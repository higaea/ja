
db.images.update({"status":"2"},{$set:{"caption_id":""}})
db.images.update({"image_id": "XEPDuWYr7P8SKb1MvSTZCQR8ihlkAokj"}, {$set: {"status": "5"}})
db.images.find({"image_id": "XEPDuWYr7P8SKb1MvSTZCQR8ihlkAokj"})

