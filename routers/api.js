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

var storage = multer.diskStorage({
    //upload path
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
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
            user_id: makeid(16)
        });

        user.save((err) => {
            if(err) {
                console.log(err);
                return res.status(401).send({success: false, message: 'Sign up failed'});
            }
            var token = generateToken({"userName": user.name});

            res.status(200).send({
                success: true, 
                message: 'Sign up succeed.',
                token: token
            });
        });
    }
});


router.get(serverConfig.loginUrl, (req, res) => {
    User.findOne({name: req.body.name}).then(user => {
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch) {
                var token = generateToken({"name": user.name});
                res.status(200).json({
                    success: true,
                    message: 'login succeed',
                    userId: user._id,
                    "token": token
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Invalid User Name or Password'
                });
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(400).json({
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
        res.status(401).send({
            success: false,
            message: 'Invalid token'
        });
    }
    next();
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

    console.log(req.params.uid);
    var image = new Image({
        image_id: makeid(16),
        user_id: req.params.uid,
        url: image.path
    });

    image.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ success: false, message: 'Image uploading failed' });
        }

        res.status(200).send({
            success: true,
            message: 'Image uploading succeed.',
        });
    });

    // console.log(image.mimetype);
    // console.log(image.originalname);
    // console.log(image.size);
    // console.log(image.path);
});

router.get(serverConfig.userImageUrl, (req, res) => {
    var userId = req.params.uid;
    Image.find({user_id: userId}, (err, images) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ success: false, message: 'Image query failed' });
        }

        var userImages = [];
        images.forEach(image => {
            userImages.push(image.url);
        });

        res.status(200).send({
            success: true,
            urls: userImages
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
        if(err) {
            console.log(err);
            res.send({
                success: false,
                message: "Failed to post comments to IG"
            });
        }
        res.send({
            success: true,
            message: "Comments posting succeed"
        });
    });

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