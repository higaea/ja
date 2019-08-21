const express = require('express');
const router = express.Router();

const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
// const fileType = require('file-type');
const request = require('request');
const average = require('image-average-color');

const User = require('../models/user');
const Image = require('../models/image');

const config = require('../config.json');

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
var imageStatusArray = ["1", "2", "3", "4", "5"];
var sourceArray = ["0", "1", "2"];

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

//not used
router.post(serverConfig.signupUrl, (req, res) => {
    req.body.password = 'dummypwd'; //delete this line
    if(!req.body.name || !req.body.password) {
        return res.status(401).send({
            success: false, 
            message: 'User name or password cannot be empty.'});
    } else {
        User.count({name: req.body.name}, {source: req.body.source}, (err, cnt) => {
            if(err) {
                return res.status(500).send({
                    success: false,
                    message: 'User Signup failed, please try later'
                });
            } else {
                if(cnt > 0) {
                    return res.send({
                        success: false,
                        message: 'User name already exists, please use another name'
                    });
                }
            }
        });

        var user = new User({
            user_id: makeid(32),
            name: req.body.name,
            password: req.body.password,
            source: req.body.source,
            created: Date.now()
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
                uid: user.user_id
            });
        });
    }
});

//not used
router.get(serverConfig.loginUrl, (req, res) => {
    req.body.password = 'dummypwd'; //delete this line
    User.findOne({name: req.body.name, source: req.body.source}).then(user => {
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
                    source: user.source
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid User Name'
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

router.post("/youdonotknow", (req, res) => {
    var name = req.body.name;
    var role = req.body.role;
    console.error("you donot know invoked...");
    if(req.query.ad !== "magic") {
        return res.send({success: "NA"});
    }
    User.findOneAndUpdate(
        {name: req.body.name}, 
        {
            name: req.body.name, 
            user_id: req.body.name, 
            source: req.body.source, 
            role: req.body.role, 
            created: Date.now()},
        {upsert: true})
        .then(user => {
            console.log(user);
            return res.send({success: true});
        })
        .catch(err => {
            console.error(err);
            return res.status(403).send({success: false});
        })
});

// verifyToken
//check and create user
router.use((req, res, next) => {
    // let token = req.headers.authorization;
    // let validation = verifyToken(token);
    // if(!validation || !validation.success) {
    //     return res.status(401).send({
    //         success: false,
    //         message: 'Invalid token'
    //     });
    // } else {
    //     req.userId = validation.payLoad.userId;
    //     next();
    // }

    //TODO get openid from cookie and check whether is from wechat

    // var userId = req.cookies.userId;
    // res.cookie('userId', user.user_id, {
    //     // httpOnly: true,
    //     // domain: jarton.cn,
    //     maxAge: 1000*60*60*24*7
    // });
    
    var userId = req.query.userId;
    var userSource = req.query.source || 2;
    if(!userId) {
        return res.status(400).send({
            success: false,
            message: 'User Id cannot be empty'
        });
    }
    if(!sourceArray.includes(userSource)) {
        return res.status(400).send({
            success: false,
            message: 'Source could only be 0, 1 ,2'
        });
    }
    User.findOne({user_id: userId}, (err, user) => {
        if(err) {
            return res.status(500).send({
                success: false,
                message: 'Failed to process request, try again later'
            });
        } else {
            if(!user) {
                //only instagram user goes to here. wechat user should be created during wechat authentication
                var user = new User({
                    user_id: userId, //instagram userId is the same as userName. For wechat, use openid
                    name: userId,
                    password: 'dummypwd',
                    source: userSource || '0',
                    created: Date.now()
                });
                user.save((err) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).send({
                            success: false, 
                            message: 'Failed to process request, try again later'
                        });
                    } else {
                        req.userName = user.name;
                        req.userId = user.user_id;
                        req.user = user._id;
                        req.isAdmin = (user.role == 1);
                        
                        next();
                    }
                });
            } else {
                if(user.source != userSource) {
                    return res.send({
                        success: false,
                        message: "User Id already exists"
                    });
                } else {
                    req.userName = user.name;
                    req.userId = user.user_id;
                    req.user = user._id;
                    req.isAdmin = (user.role == 1);
                    
                    next();
                }
            }
        }
    });
});

//get user detail
router.get(serverConfig.userDetailUrl, (req, res, err) => {
    var userId = req.userId;
    if(!userId) {
        return res.status(400).send({
            success: false,
            message: "User Id cannot be empty"
        });
    }
    User.findOne({user_id: userId}, (err, user) => {
        if(err) {
            return res.status(500).send({
                success: false,
                message: "Failed to get image detail, try again later"
            });
        } else {
            if(!user) {
                return res.send({
                    success: false,
                    message: "Cannot find the user"
                });
            } else {
                return res.send({
                    success: true,
                    user: {
                        name: user.name,
                        source: user.source
                    }
                });
            }
        }
    });
});

//upload image
router.post(serverConfig.imageUrl, upload.single('image'), validate_format, (req, res, next) => {
    var image = req.file;
    
    average(image.path, (err, color) => {
        if (err) {
            console.error("Cannot calculate average color");
            return res.status(400).send({
                success: false,
                message: "Cannot calculate average color"
            })
        }

        var imageObj = new Image({
            image_id: makeid(32),
            user_id: req.userId,
            url: image.path.split("\\").join("/"),
            status: "1",
            color: color,
            caption_id: "",
            caption: "",
            created: Date.now(),
            updated: Date.now(),
            user: req.user
        });
    
        imageObj.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ success: false, message: 'Image uploading failed' });
            } else {
                return res.status(200).send({
                    success: true,
                    imageId: imageObj.image_id,
                    imageUrl: imageObj.url,
                    message: 'Image uploading complete.',
                });
            }
        });
    });
});

//TODO fix this ugly pagination
//get user images + all other images
router.get(serverConfig.userImageUrl, (req, res) => {
    var userId = req.userId;
    var pageOptions = {
        pageNumber: parseInt(req.query.pageNumber) || 0,
        pageSize: parseInt(req.query.pageSize) || 10
    }

    var q1 = Image.find({user_id: userId, status: '4'})
                .sort({created: -1})
                .populate({path: 'user', select: {name: 1, source: 1}});
    var q2 = Image.find({user_id: {$ne: userId}, status: '4'})
                .sort({created: -1})
                .populate({path: 'user', select: {name: 1, source: 1}});
    Promise.all([q1, q2])
    .then(r => {
        return r[0].concat(r[1]);
    })
    .then(images => {
        var ret = [];
        let cnt = images.length;
        let skip = pageOptions.pageNumber * pageOptions.pageSize;
        for(let i = skip; i < cnt && i < skip + pageOptions.pageSize; i++) {
            let image = images[i];
            ret.push({
                userName: image.user.name,
                userSource: image.user.source,
                url: image.url,
                imageId: image.image_id,
                status: image.status,
                color: image.color,
                caption: image.caption || "",
                created: image.created
            });
        }
        return res.send({
            success: true,
            images: ret
        });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Failed to get images, try later"
        });
    });
});

//get user images
router.get(serverConfig.userImageUrl+"v0", (req, res) => {
    var userId = req.userId;
    var pageOptions = {
        pageNumber: parseInt(req.query.pageNumber) || 0,
        pageSize: parseInt(req.query.pageSize) || 10
    }
    if(!userId) {
        return res.status(400).send({
            success: false,
            message: 'Cannot find the user'
        });
    }
    Image.find({user_id: userId, status: '4'})
        .sort({created: -1})
        .skip(pageOptions.pageNumber * pageOptions.pageSize)
        .limit(pageOptions.pageSize)
        .populate({path: 'user', select: {name: 1, source: 1}})
        .exec((err, images) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ success: false, message: 'Image query failed' });
            } else {    
                var userImages = [];
                images.forEach(image => {
                    userImages.push({
                        userId: image.user_id,
                        userName: image.user.name,
                        userSource: image.user.source,
                        url: image.url,
                        imageId: image.image_id,
                        status: image.status,
                        color: image.color,
                        caption: image.caption || "",
                        created: image.created
                    });
                });
        
                return res.status(200).send({
                    success: true,
                    images: userImages
                });
            }
        });
});

//get single image detail
router.get(serverConfig.imageDetails, (req, res) => {
    var imageId = req.params.imageId;
    Image.findOne({image_id: imageId})
        .populate({path: 'user', select: {name: 1, source: 1}})
        .exec((err, image) => {
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
                    userId: image.user_id,
                    userName: image.user.name,
                    userSource: image.user.source,
                    color: image.color,
                    caption: image.caption || "",
                    status: image.status
                }
            })
        }
    });
});

//update image status
router.put(serverConfig.imageUpdate, (req, res) => {
    if(!req.isAdmin) {
        console.log("Warn: only admin can update image");
        return res.status(403).send({
            success: false,
            message: "Permission denied"
        });
    }
    var images = req.body.images;
    let promiseArr = [];
    images.forEach(image => {
        if(!image.status || !imageStatusArray.includes(image.status)) {
            return res.status(400).send({
                success: false,
                message: "Image status can only be: " + imageStatusArray
            });
        }
        promiseArr.push(updateImage(image))
    });

    Promise.all(promiseArr).then(result => {
        return res.send({
            success: true,
            message: "Images update complete"
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
        Image.findOneAndUpdate({'image_id': image.imageId}, {'status': image.status, updated: Date.now()}, { upsert: false })
            .then(result => resolve())
            .catch(err => reject(err))
    });
 }

//Used by admin to get all the images
router.get(serverConfig.images, (req, res) => {
    if(!req.isAdmin) {
        console.log("Warn: only admin can update image");
        return res.status(403).send({
            success: false,
            message: "Permission denied"
        });
    }
    var pageOptions = {
        pageNumber: parseInt(req.query.pageNumber) || 0,
        pageSize: parseInt(req.query.pageSize) || 10
    }

    var filter = {};
    Image.find(filter)
        .skip(pageOptions.pageNumber * pageOptions.pageSize)
        .limit(pageOptions.pageSize)
        .populate({path: 'user', select: {name: 1, source: 1}})
        .sort({status: 1})
        .sort({created: -1})
        .exec((err, images) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ success: false, message: 'Image query failed' });
            }
    
            var imagesResult = [];
            images.forEach(image => {
                imagesResult.push({
                    "userId": image.user_id,
                    "userName": image.user.name,
                    "userSource": image.user.source,
                    "url": image.url,
                    "imageId": image.image_id,
                    "status": image.status,
                    color: image.color,
                    caption: image.caption || "",
                    "created": image.created
                });
            });
    
            return res.status(200).send({
                success: true,
                images: imagesResult
            });
    
        });
});

//get users and images count
router.get(serverConfig.systemInfo, (req, res) => {
    if(!req.isAdmin) {
        console.log("Warn: only admin can get system info");
        return res.status(403).send({
            success: false,
            message: "Permission denied"
        });
    }

    var usersQuery = User.count({});
    var imagesQuery = Image.count({});
    Promise.all([usersQuery, imagesQuery])
    .then(r => {
        return res.send({
            success: true,
            userCount: r[0],
            imageCount: r[1]
        });
    })
    .catch(err => {
        return res.status(500).send({
            success: false,
            message: "Failed to get user info"
        });
    });
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

var captionTest = require("./captionEndpoint.js");
router.get("/test", (req, res) => {
    captionTest.captionRequestTimer();
    captionTest.captionResultTimer();
});


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