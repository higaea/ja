const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
// const fileType = require('file-type');
const request = require('request');
const User = require('../models/user');
const Image = require('../models/image');

const config = require('../config.json');
// const upload = multer({dest: 'upload'});

var header = {
    "alg": "RS256",
    "typ": "JWT"
  };

var privateCert = fs.readFileSync('./keys/private.key');
var publicCert = fs.readFileSync('./keys/public.key');

var jwtSignOption = {
    "algorithm": "RS256", 
    "expiresIn":"1d"
};

var tokenType = "Bearer ";

var serverConfig = config.serverConfig;
var imageConfig = config.imageConfig;
var instagramConfig = config.instagramConfig;
var captionConfig = config.captionConfig;

var storage = multer.diskStorage({
    //upload path
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    //rename image
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, makeid(16) + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

var limits = {
    fieldSize: 10
};
    
var upload = multer({
         storage: storage,
         limits: {
             fieldSize: 10
        }
        //  fileFilter: (req, file, cb) => {
        //     // if the file extension is in our accepted list
        //     if (imageConfig.type.some(ext => file.originalname.endsWith("." + ext))) {
        //         return cb(null, true);
        //     }
    
        //     // otherwise, return error
        //     return cb(new Error('Only ' + imageConfig.type.join(", ") + ' files are allowed!'));
        // }
    
});

router.post(serverConfig.signupUrl, (req, res) => {
    if(!req.body.name || !req.body.password) {
        res.status(401).send({
            success: false, 
            message: 'User name or password cannot be empty.'});
    } else {
        var user = new User({
            name: req.body.name,
            password: req.body.password,
            source: req.body.source,
            user_id: makeid(32)
        });

        user.save((err) => {
            if(err) {
                console.log(err);
                return res.status(401).send({success: false, message: 'Sign up failed'});
            }
            var token = generateToken({
                "userName": user.name,
                "userId": user.user_id
            });

            return res.status(200).send({
                success: true, 
                message: 'Sign up completed',
                uid: user.user_id,
                token: token
            });
        });
    }
});


router.get(serverConfig.loginUrl, (req, res) => {
    User.findOne({name: req.body.name}).then(user => {
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch) {
                var token = generateToken({
                    "userName": user.name,
                    "userId": user.user_id
                });
                return res.status(200).json({
                    success: true,
                    message: 'login complete',
                    userId: user.user_id,
                    source: user.source,
                    "token": token
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid User Name or Password'
                });
            }
        });
    }).catch(err => {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: 'Invalid User Name or Password'
        });
    });
});

//verifyToken
router.use((req, res, next) => {
    let token = req.headers.authorization;
    let validation = verifyToken(token);
    if(!validation || !validation.success) {
        return res.status(401).send({
            success: false,
            message: 'Invalid token'
        });
    } else {
        req.userId = validation.payLoad.userId;
        next();
    }
});

router.post(serverConfig.imageUrl, upload.single('image'), validate_format, (req, res, next) => {
    var image = req.file;
    //get user name from http param, 
    //compare with token, verify token, get payload and get user name or user uuid?
    //findone from db, 
    //create an image record and save into mongo db
    //how to query all the images belonging to one user?

    // var userId = req.query.user_id;
    // User.findOne({user_id: userId}).then(user => {
        
    // });

    //TODO need to verify the uid is the same as the token one
    console.log(req.query);
    console.log(req.params);
    var image = new Image({
        image_id: makeid(32),
        user_id: req.userId,
        // url: image.path.replace(new RegExp("\\", 'g'), "/")
        url: image.path.split("\\").join("/"),
        status: "NEW",
        caption: "",
    });

    image.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ success: false, message: 'Image uploading failed' });
        } else {
            return res.status(200).send({
                success: true,
                imageId: image.image_id,
                imageUrl: image.url,
                message: 'Image uploading complete.',
            });
        }
    });

    // console.log(image.mimetype);
    // console.log(image.originalname);
    // console.log(image.size);
    // console.log(image.path);
});

router.get(serverConfig.userImageUrl, (req, res) => {
    var userId = req.query.uid;
    var pageOptions = {
        pageNumber: parseInt(req.query.pageNumber) || 0,
        pageSize: parseInt(req.query.pageSize) || 10
    }
    Image.find({user_id: userId})
        .skip(pageOptions.pageNumber * pageOptions.pageSize)
        .limit(pageOptions.pageSize)
        .exec((err, images) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ success: false, message: 'Image query failed' });
            } else {    
                var userImages = [];
                images.forEach(image => {
                    userImages.push({
                        url: image.url,
                        imageId: image.image_id,
                        status: image.status || "NEW",
                        caption: image.caption || "This is a mocked caption"
                    });
                });
        
                return res.status(200).send({
                    success: true,
                    images: userImages
                });
            }
        });

    // Image.find({user_id: userId}, (err, images) => {
    //     if(err) {
    //         console.log(err);
    //         return res.status(500).send({ success: false, message: 'Image query failed' });
    //     }

    //     var userImages = [];
    //     images.forEach(image => {
    //         userImages.push(image.url);
    //     });

    //     res.status(200).send({
    //         success: true,
    //         urls: userImages
    //     });

    // });
});

router.get(serverConfig.imageDetails, (req, res) => {
    var imageId = req.params.imageId;
    Image.findOne({image_id: imageId}, (err, image) => {
        if(err || !image) {
            return res.send({
                success: false,
                message: "Failed to get image detail"
            });
        } else {
            return res.send({
                success: true,
                image: {
                    url: image.url,
                    caption: image.caption || "This is a mocked caption"
                }
            })
        }
    });
});

router.put(serverConfig.imageUpdate, (req, res) => {
    var images = req.body.images;
    let promiseArr = [];
    images.forEach(image => promiseArr.push(updateImage(image)));

    Promise.all(promiseArr).then(result => {
        return res.send({
            success: true,
            message: "Update images complete"
        });
    })
    .catch(err => {
        return res.status(500).send({
            success: false,
            message: "Failed to update image"
        });
    });


});

function updateImage(image) {
    return new Promise((resolve, reject) => {
        Image.findOneAndUpdate({"image_id": image.imageId}, {"url": image.status}, { upsert: false })
            .then(result => resolve())
            .catch(err => reject(err))
    });
 }


router.get(serverConfig.images, (req, res) => {
    var pageOptions = {
        pageNumber: parseInt(req.query.pageNumber) || 0,
        pageSize: parseInt(req.query.pageSize) || 10
    }
    Image.find({})
        .skip(pageOptions.pageNumber * pageOptions.pageSize)
        .limit(pageOptions.pageSize)
        .exec((err, images) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ success: false, message: 'Image query failed' });
            }
    
            var imagesResult = [];
            images.forEach(image => {
                imagesResult.push({
                    "url": image.url,
                    "uid": image.user_id,
                    "imageId": image.image_id,
                    "status": image.status || "This is a mocked status"
                });
            });
    
            return res.status(200).send({
                success: true,
                images: imagesResult
            });
    
        });
});

router.get(serverConfig.userCount, (req, res) => {
    User.count({}, (err, cnt) => {
        if(err) {
            return res.send({
                success: false,
                message: "Failed to get user count"
            });
        } else {
            return res.send({
                success: true,
                count: cnt
            });
        }
    }) ;
});

router.get(serverConfig.imageCount, (req, res) => {
    Image.count({}, (err, cnt) => {
        if(err) {
            return res.send({
                success: false,
                message: "Failed to get image count"
            });
        } else {
            return res.send({
                success: true,
                count: cnt
            });
        }
    }) ;
});

router.post(serverConfig.instagramPostCommentUrl, (req, res) => {
    var comment = req.body.comment;
    var media_id = req.body.media_id;
    var igRequestUrl = instagramConfig.postCommentOnMediaUrl.replace(":media_id", media_id);
    var paramObject = {
        message: comment,
        access_token: instagramConfig.accessToken
    };
    request.post({
        url: igRequestUrl,
        qs: paramObject
    }, (err, resp, body) => {
        if(err || resp.statusCode != 200) {
            console.log(err);
            return res.send({
                success: false,
                message: "Failed to post comments to IG"
            });
        }
        return res.send({
            success: true,
            message: "Comments posting complete"
        });
    });

});

router.post("/caption", (req, res) => {
    console.log(req.userId);
    invokeCaption(req.body.url, (reqResult) => {
        if(reqResult.success) {
            // User.findOne({name: req.body.name}).then(
            Image.findOne({image_id: req.body.imageId}).then((image) => {
                image.caption_id = reqResult.imageCaptionId;
                image.save((err) => {
                    if(err) {
                        console.log(err);
                        console.log("Failed to update image " + image.image_id + " with captionId");
                        return res.send({
                            success: false,
                            message: "Failed to save image caption id"
                        });
                    }
                });
            });
            getCaptionResult(reqResult.imageCaptionId, (r) => {
                console.log(r);
                if(r.success) {
                    Image.findOne({image_id: req.body.imageId}).then((image) => {
                        image.caption = r.caption;
                        image.save((err) => {
                            if(err) {
                                console.log(err);
                                console.log("Failed to update image " + image.image_id + " with caption");
                                return res.send({
                                    success: false,
                                    message: "Failed to update image"
                                });
                            }
                        });
                    });
                }
                return res.send(r);
            });
        } else {
            return res.send(reqResult);
        }
    });
    console.log("in caption...");
});

function invokeCaption(url, cb) {
    var requestbody = {
        "url": url
    }
    request.post(
        captionConfig.captionRequestUrl,
        {json: requestbody}, 
        (err, resp, body) => {
            if(err || resp.statusCode != 200) {
                console.log(err);
                cb({
                    success: false,
                    message: "Failed to send caption request, please try again"
                });
            } else {
                console.log("caption request body: " + body);
                if(body.error) {
                    cb({
                        success: false,
                        message: rr.error
                    });
                } else {
                    cb({
                        success: true,
                        imageCaptionId: body.sha256sum 
                    });
                }
            }
        });
}

function getCaptionResult(imageCaptionId, cb) {
    console.log("image caption id: " + imageCaptionId);
    var reqUrl = captionConfig.captionResultUrl.replace(":image_caption_id", imageCaptionId);
    var maxTime = 100;
    var isCBCalled = false;
    var interval = setInterval(() => {
        if(maxTime-- < 0) {
            console.log("captioning timeout...");
            clearInterval(interval);
            if(!isCBCalled) {
                cb({
                    success: false,
                    message: "failed to get caption",
                    imageCaptoinId: imageCaptionId
                });
                isCBCalled = true;
            }
        }
        request.get(reqUrl, (err, resp, body) => {
            if(err || resp.statusCode != 200) {
                // console.log("err...");
            } else {
                var rr = JSON.parse(body);
                if(rr.error) {
                    //wait a while
                    console.log("still waiting for caption result...");
                } else {
                    clearInterval(interval);
                    if(!isCBCalled) {
                        cb({
                            success: true,
                            caption: rr.caption,
                            imageCaptoinId: imageCaptionId
                        });
                        isCBCalled = true;
                    }
                }
            }
        });
    }, 3000);
}

function generateToken(payLoad) {
    return tokenType + jwt.sign(payLoad, privateCert, jwtSignOption);
}

function verifyToken(token) {
    if(token && token.startsWith(tokenType)) {
        return jwt.verify(token.split(tokenType)[1], publicCert, (err, decoded) => {
            if(err || !decoded) {
                return {
                    success: false,
                    message: 'Invalid Token'
                };
            }
            return {
                success: true,
                message: 'Valid Token',
                payLoad: decoded
            };
        });
    }

    return {
        success: false,
        message: 'Invalid Token'
    };
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 /**
 * Middleware for validating file format
 */
function validate_format(req, res, next) {
    // For MemoryStorage, validate the format using `req.file.buffer`
    // For DiskStorage, validate the format using `fs.readFile(req.file.path)` from Node.js File System Module
    // let mime = fileType(req.file.path);

    var image = req.file;
    // var fileFormat = (image.originalname).split(".")[2];

    // imageConfig.type.some(ext => file.originalname.endsWith("." + ext))

    // if can't be determined or format not accepted
    if(!imageConfig.type.some(ext => image.originalname.toLowerCase().endsWith("." + ext))) {
        return res.send({
            success: false,
            message: 'Only ' + imageConfig.type.join(", ") + ' files are allowed!'
        });
    }

    if(image.size < imageConfig.min_size || image.size > imageConfig.max_size) {
        return res.send({
            success: false,
            message: 'Image size should be [50k, 10m]'
        });
    }
    next();
}


module.exports = router;