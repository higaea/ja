const request = require('request');
const User = require('../models/user');
const Image = require('../models/image');

const config = require('../config.json');

const domain = "http://www.jarton.cn/";

var captionConfig = config.captionConfig;

var captionRequestMap = new Map();
var invalidCaptionRequestImageMap = new Map();
var invalidCaptionResultImageMap = new Map();

function invokeCaption(imageId, url, cb) {
    if(captionRequestMap.get(imageId) === 1) {
        console.log(imageId + ": " + (new Date()).toUTCString + ": already sent caption request, ignore");
        return;
    }
    console.log(imageId + ": " + (new Date()).toUTCString + ": Start send caption request");
    captionRequestMap.set(imageId, 1);
    var requestbody = {
        "url": url
    };
    request({
            url: captionConfig.captionRequestUrl,
            method: "POST",
            headers: {
                "content-type": "application/json",
                },
            // json: requestbody,
            body: JSON.stringify(requestbody)
        }, (err, resp, body) => {
            if(err || resp.statusCode != 200) {
                if(err) {
                    console.error(imageId + ": " + (new Date()).toUTCString + ": Send caption requestion error, " + err);
                }
                return cb({
                    success: false,
                    message: imageId + ": Failed to send caption request, please try again"
                });
            } else {
                console.log(imageId + ": " + (new Date()).toUTCString + ": CaptionId returned: " + body);
                var bodyJson;
                try{
                    bodyJson = JSON.parse(body);
                } catch(e) {
                    console.error(imageId + ": " + (new Date()).toUTCString + ": Parse caption request body exception: " + e);
                    return cb({
                        success: false,
                        message: imageId + ": Parse caption request body exception: " + e
                    });
                }

                if(bodyJson.error) {
                    return cb({
                        success: false,
                        message: rr.error
                    });
                } else {
                    return cb({
                        success: true,
                        imageCaptionId: bodyJson.sha256sum,
                        captionServer: bodyJson.port
                    });
                }
            }
    });
}

function captionRequestTimer() {
    setInterval(() => {
        console.log("loading reviewed images..");
        Image.find({
            "status": "2",
            "caption_id": ""
        }).limit(5).exec((err, images) => {
                if(err) {
                    console.error("captionRequestTimer: Failed to look for reviewed images");
                }
                for(let i = 0; i < images.length; i++) {
                    invokeCaption(images[i].image_id, domain + images[i].url, (reqResult) => {
                        if(reqResult.success) {
                            images[i].caption_id = reqResult.imageCaptionId;
                            images[i].port = reqResult.captionServer;
                            images[i].status = "3";
                            images[i].updated = Date.now();
                            images[i].save((err) => {
                                if(err) {
                                    console.error(images[i].image_id + ": " + (new Date()).toUTCString + ": Failed to save caption request, " + err);
                                }
                                captionRequestMap.delete(images[i].image_id);
                                invalidCaptionRequestImageMap.delete(images[i].image_id);
                            });
                        } else {
                            console.error(reqResult);
                            let c = invalidCaptionRequestImageMap.get(images[i].image_id);
                            if(c) {
                                if(c >= 3) {
                                    images[i].status = "6";
                                    images[i].updated = Date.now();
                                    images[i].save((err) => {
                                        if(err) {
                                            console.error(err);
                                            console.error(images[i].image_id + ": " + (new Date()).toUTCString + ": Failed to request caption");
                                        } else {
                                            console.error(images[i].image_id + ": " + (new Date()).toUTCString + ": Reach max request caption cnt");
                                        }
                                        captionRequestMap.delete(images[i].image_id);
                                        invalidCaptionRequestImageMap.delete(images[i].image_id);
                                    });
                                } else {
                                    captionRequestMap.set(images[i].image_id, 0);
                                    invalidCaptionRequestImageMap.set(images[i].image_id, c + 1);
                                }
                            } else {
                                captionRequestMap.set(images[i].image_id, 0);                                
                                invalidCaptionRequestImageMap.set(images[i].image_id, 2);
                            }
                        }
                    });
                }
            });
    }, 5000);
    
}


function getCaptionResult(imageId, imageCaptionId, captionServer, cb) {
    console.log(imageId + ": " + (new Date()).toUTCString + ": Try to get image caption, image id: " + ", caption id: " + imageCaptionId + ", port: " + captionServer);
    var reqUrl = captionConfig.captionResultUrl.replace("port", captionServer).replace(":image_caption_id", imageCaptionId);
    request.get(reqUrl, (err, resp, body) => {
        if(err || resp.statusCode != 200) {
            if(err) {
                console.error(imageId + ": " + (new Date()).toUTCString + ": Error: get CaptionResult: " + err);
            }
            return cb({
                success: false,
                message: imageId + ": still waiting for captin result"
            });
        } else {
            var rr;
            try{
                rr = JSON.parse(body);
            } catch (e) {
                console.error("Parse Caption Result Exception: " + e);
                return cb({
                    success: false,
                    message: imageId + ": still waiting for captin result"
                });
            }

            if(rr.error) {
                //wait a while
                console.log(imageId + ": " + (new Date()).toUTCString + ": still waiting for caption result...");
                return cb({
                    success: false,
                    message: imageId + ": still waiting for captin result"
                });
            } else {
                console.log(imageId + ": " + (new Date()).toUTCString + ": Got image caption, caption: " + rr.caption);
                return cb({
                    success: true,
                    caption: rr.caption,
                    imageCaptoinId: imageCaptionId
                });
            }
            
        }
    });
}


function captionResultTimer() {
    setInterval(() => {
        console.log("loading captioning images..");
        Image.find({"status": "3"})
            .limit(10)
            .exec((err, images) => {
                if(err) {
                    console.error("captionRequestTimer: Failed to look for captioning images, " + err);
                }
                for(let i = 0; i < images.length; i++) {
                    getCaptionResult(images[i].image_id, images[i].caption_id, images[i].port, (reqResult) => {
                        if(reqResult.success) {
                            images[i].caption = reqResult.caption;
                            images[i].status = "4";
                            images[i].interActiveStatus = "0";
                            images[i].updated = Date.now();
                            images[i].save((err) => {
                                if(err) {
                                    console.error(images[i].image_id + ": " + (new Date()).toUTCString + ": Failed to save caption, " + err);
                                }
                                invalidCaptionResultImageMap.delete(images[i].image_id);                                
                            });
                        } else {
                            console.error(reqResult);
                            let c = invalidCaptionResultImageMap.get(images[i].image_id);
                            if(c) {
                                if(c > 20) {
                                    images[i].status = "4";
                                    images[i].interActiveStatus = "0";
                                    images[i].updated = Date.now();
                                    images[i].caption = "No Caption";
                                    images[i].save((err) => {
                                        if(err) {
                                            console.error(images[i].image_id + ": " + (new Date()).toUTCString + ": Failed to get caption, " + err);
                                        } else {
                                            console.error(images[i].image_id + ": " + (new Date()).toUTCString + ": Reach the getting caption result max cnt, ignore.");
                                        }
                                    });
                                    invalidCaptionResultImageMap.delete(images[i].image_id);
                                } else {
                                    invalidCaptionResultImageMap.set(images[i].image_id, c + 1);
                                }
                            } else {
                                invalidCaptionResultImageMap.set(images[i].image_id, 1);
                            }
                        }
                    });
                }
            });
    }, 6000);
}


module.exports = {
    captionRequestTimer: captionRequestTimer,
    captionResultTimer: captionResultTimer
};