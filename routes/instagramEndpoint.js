const express = require('express');
const router = express.Router();

const request = require('request');
const User = require('../models/user');
const Image = require('../models/image');

const config = require('../config.json');

const util = require('util');
const getPromise = util.promisify(request.get);

const instagramAPI = "https://graph.facebook.com/v4.0/";

var access_token="EAAg3U9spCgEBANe9JS9b0uMaRILzf1jReHhJgNgo5ot8xbvWLfoKSA083vs2wDVgsl379Yt2xgIVaMEjK6XMyEELjY8QXeuxZBaeloNdZCgDI6ZCBnBqUdPZACbMLr7FYRlbMUgjTFG0SCNXYyFqwijcsn1BYa93UEyh8gEpjAZDZD";
var jartonUserPage = "108544473825677";
var jartonBizAccount = "17841416927087202";
var mediaObjectId = "17862847066461005";
var postUrl = instagramAPI + mediaObjectId + "/comments?" 
            + "access_token=" + access_token + "&message=";
var getMediaListUrl = instagramAPI + jartonBizAccount + "/media?" + "access_token=" + access_token;
var getMediaDetailsUrl = instagramAPI + "MEDIAID?" + "access_token=" + access_token 
            + "&fields=caption,timestamp";

var targetMediaContent = "jarton";


var postRequestMap = new Map();

function instagramPostComment(userId, imageId, caption, cb) {
    console.log(imageId + ": Start post Instagram comment.");
    if(postRequestMap.get(imageId) === 1) {
        console.log(imageId + ": already send post comment request");
        return;
    }
    postRequestMap.set(imageId, 1);
    var comment = "@" + userId + " " + caption;
    request(
        {
            url: postUrl + comment,
            method: "POST",
            headers: {
                "content-type": "application/json",
                }
        }, (err, resp, body) => {
            if(err) {
                return cb({
                    success: false,
                    message: imageId + ": Failed to post comment, error: " + err
                });
            } else {
                var bodyJson;
                try{
                    bodyJson = JSON.parse(body);
                } catch(e) {
                    return cb({
                        success: false,
                        message: imageId + ": Failed to post comment, error: " + e
                    });
                }

                if(bodyJson.error) {
                    return cb({
                        success: false,
                        message: bodyJson
                    });
                } else {
                    return cb({
                        success: true,
                        message: imageId + ": Post comment complete."
                    });
                }
            }
        }
    );
}

function commentTimer() {
    setInterval(() => {
        console.log("Loading instagram images for comments..");
        var filter = {
            "status": "4", 
            "caption": {$ne: ""}, 
            "interActiveStatus": "0"
        }
        Image.find(filter).limit(5).exec((err, images) => {
            if(err) {
                console.error("Error: images query issue");
                return;
            } else {
                for(let i = 0; i < images.length; i++) {
                    instagramPostComment(images[i].user_id, images[i].image_id, images[i].caption, (postResult) => {
                        if(postResult.success) {
                            images[i].interActiveStatus = 1;
                            
                        } else {
                            images[i].interActiveStatus = 2;
                            console.error(postResult);
                        }
                        images[i].updated = Date.now();
                        images[i].save((err) => {
                            if(err) {
                                console.error(images[i].image_id + ": Failed to update image interActiveStatus");
                            }
                            console.log(images[i].image_id + ": Instagram comment post complete.")
                        });
                        postRequestMap.delete(images[i].image_id);
                    });
                }
            }
        });
    }, 6000)
    
}

function getMediaDetails(imageId) {
    return new Promise((resolve, reject) => {
        let url = getMediaDetailsUrl.replace("MEDIAID", imageId);
        getPromise(url).then((value)=>{
            //{"caption":"this is an instagram media description","timestamp":"2019-08-09T08:34:28+0000","id":"17862847066461005"}
            resolve(value.body);
        }).catch((err)=>{
            reject(err);
        });
    });
 }

function updateTargetMedia(targetMediaContent, cb) {
    console.log("Update target media...");
    request.get(getMediaListUrl, (err, resp, body) => {
        if(err || resp.statusCode != 200) {
            return cb({
                success: false,
                message: "Failed to get media objects"
            });
        } else {
            var bodyJson;
            try {
                bodyJson = JSON.parse(body);
            } catch(e) {
                console.error("Failed to update target media: " + e);
                return cb({
                    success: false,
                    message: "Failed to get target media object: " + e
                });
            }
            var medias = bodyJson.data;
            
            let promiseArr = [];
            for(let i = 0; i < medias.length; i++) {
                promiseArr.push(getMediaDetails(medias[i].id));
            }

            Promise.all(promiseArr).then(detailedImages => {
                var targetMedia;
                for(let j = 0; j < detailedImages.length; j++) {
                    let imageDetail = JSON.parse(detailedImages[j]);
                    console.log("updateTargetMedia: " + imageDetail);
                    if(!targetMedia) {
                        targetMedia = imageDetail;
                    } else {
                        if(imageDetail.caption
                            && imageDetail.caption.includes(targetMediaContent) 
                            && imageDetail.timestamp 
                            && targetMedia.timestamp 
                            && imageDetail.timestamp > targetMedia.timestamp) {
                                targetMedia = imageDetail;
                        }
                    }
                }
                    
                console.log("Target Media Found: " + targetMedia.id);
                mediaObjectId = targetMedia.id;
                postUrl = instagramAPI + mediaObjectId + "/comments?" 
                       + "access_token=" + access_token + "&message=";

                return cb({
                    success: true,
                    message: "Update target media complete. Target media is posted at: " + targetMedia.timestamp
                });
            })
            .catch(err => {
                console.error({
                    success: false,
                    message: "Failed to get target media object"
                });
                return cb({
                    success: false,
                    message: "Failed to get target media object"
                });
            });
        }
    });
}


module.exports = {
    commentTimer: commentTimer,
    updateTargetMedia: updateTargetMedia
};