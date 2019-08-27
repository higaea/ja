
db.images.update({"status":"2"},{$set:{"caption_id":""}})
db.images.update({"image_id": "XEPDuWYr7P8SKb1MvSTZCQR8ihlkAokj"}, {$set: {"status": "5"}})
db.images.find({"image_id": "XEPDuWYr7P8SKb1MvSTZCQR8ihlkAokj"})

db.images.find({"user_id": "DerekDu666"})

http://www.jarton.cn/target_image?userId=dhl&source=1&content=aaa //aaa is the content in instagram post
http://www.jarton.cn/comment_toggle?userId=dhl&source=1&toggle=1 //0: turn off, 1: turn on

docker run -d -v /root/app:/root/app -w /root/app -p 80:80 -p 443:443 node app.js
docker run -d --name neuraltalk2-web-5001 -p 5001:5000 -v /root/t/captiondata:/mounted jacopofar/neuraltalk2-web:latest



