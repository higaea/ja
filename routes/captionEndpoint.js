const request = require('request');
const User = require('../models/user');
const Image = require('../models/image');

const config = require('../config.json');

const domain = "http://www.jarton.cn/";

var captionConfig = config.captionConfig;


function invokeCaption(imageId, url, cb) {
    console.log("Start send caption request, image id: " + imageId);
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
                console.log(err);
                cb({
                    success: false,
                    message: "Failed to send caption request, please try again"
                });
            } else {
                console.log("CaptionId returned: " + body + ", image id: " + imageId);
                var bodyJson = JSON.parse(body);
                if(bodyJson.error) {
                    cb({
                        success: false,
                        message: rr.error
                    });
                } else {
                    cb({
                        success: true,
                        imageCaptionId: bodyJson.sha256sum 
                    });
                }
            }
    });
}

function captionRequestTimer() {
    setInterval(() => {
        console.log("loading reviewed images..");
        Image.find({"status": "2"})
            .exec((err, images) => {
                if(err) {
                    console.error("captionRequestTimer: Failed to look for reviewed images");
                }
                for(let i = 0; i < images.length; i++) {
                    invokeCaption(images[i].image_id, domain + images[i].url, (reqResult) => {
                        if(reqResult.success) {
                            images[i].caption_id = reqResult.imageCaptionId;
                            images[i].status = "3";
                            images[i].updated = Date.now();
                            images[i].save((err) => {
                                if(err) {
                                    console.error(err);
                                    console.error("Failed to request caption, image: " + images[i].image_id);
                                }
                            });
                        } else {
                            console.error(reqResult);
                        }
                    });
                }
            });
    }, 5000);
    
}


function getCaptionResult(imageId, imageCaptionId, cb) {
    console.log("Try to get image caption, image id: " + imageId + ", caption id: " + imageCaptionId);
    var reqUrl = captionConfig.captionResultUrl.replace(":image_caption_id", imageCaptionId);
    request.get(reqUrl, (err, resp, body) => {
        if(err || resp.statusCode != 200) {
            console.log("Error: get CaptionResult: " + err);
        } else {
            var rr = JSON.parse(body);
            if(rr.error) {
                //wait a while
                console.log("still waiting for caption result...");
            } else {
                console.log("Got image caption, image id: " + imageId + ", caption: " + rr.caption);
                cb({
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
            .exec((err, images) => {
                if(err) {
                    console.error("captionRequestTimer: Failed to look for captioning images, " + err);
                }
                for(let i = 0; i < images.length; i++) {
                    getCaptionResult(images[i].image_id, images[i].caption_id, (reqResult) => {
                        if(reqResult.success) {
                            images[i].caption = reqResult.caption;
                            images[i].status = "4";
                            images[i].updated = Date.now();
                            images[i].save((err) => {
                                if(err) {
                                    console.error(err);
                                    console.error("Failed to save caption, image: " + images[i].image_id);
                                }
                            });
                        } else {
                            console.error(reqResult);
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