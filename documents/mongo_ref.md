
db.images.update({"status":"2"},{$set:{"caption_id":""}})
db.images.update({"image_id": "XEPDuWYr7P8SKb1MvSTZCQR8ihlkAokj"}, {$set: {"status": "5"}})
db.images.find({"image_id": "XEPDuWYr7P8SKb1MvSTZCQR8ihlkAokj"})
db.images.find({"user_id": "__test__", "status": "1"}, {image_id: 1, status: 1});
db.images.update({"user_id": "__test__"}, {$set: {"status": "5"}})
db.images.update({"image_id": "xc58w13lQ2R1haoaDEqE2Ic8fSkOoRJt", {$set: {"port": "5004"}}})

db.images.find({"user_id": "DerekDu666"})

http://www.jarton.cn:8080/target_image?userId=dhl&source=1&content=aaa //aaa is the content in instagram post
http://www.jarton.cn:8080/comment_toggle?userId=dhl&source=1&toggle=1 //0: turn off, 1: turn on

docker run -d -v /root/app:/root/app -w /root/app -p 80:80 -p 443:443 node app.js
docker run -d --name neuraltalk2-web-5001 -p 5001:5001 -e "port=5001" -v /captiondata:/mounted jacopofar/neuraltalk2-web:latest

## replace file in container
#copy out
docker cp neuraltalk2-web-5005:/webapp/index.js .
#copy in
docker cp index.js neuraltalk2-web-5005:/webapp/index.js

- running the APP:

		sudo docker run --name neuraltalk2-web -p 5000:5000 -v /home/reverie-reset/captiondata:/mounted jacopofar/neuraltalk2-web:latest

- running the BASH

		docker exec -it neuraltalk2-web bash

- Getting the sha256sum:

		curl -X POST -H "Content-Type: application/json" -d '{"url":"http://192.168.1.143:8080/1.jpg"}' 'http://localhost:5000/addURL'

This returns a JSON like this:

		{"extension":"jpg","sha256sum":"c79dd842f5343ec810b7a8a425195794a89e259b36bc7768323f5e50f888db7a"}

- Getting the caption:

		curl 'http://localhost:5000/caption/c79dd842f5343ec810b7a8a425195794a89e259b36bc7768323f5e50f888db7a'

