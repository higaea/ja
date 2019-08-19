All APIs can be called from https://www.jarton.cn/

1. user signup (not used)
POST /api/user/signup
request:
    Content-Type: application/json
    {
        name: String
        source: Int //0: none, 1: wechat, 2: instagram
        role: //user:0, admin:1
    }
response:
    {
    "success": true,
    "uid": uid,
}

2. user login (not used)
GET /api/user/login
request:
    {
        name: String
        source: Int //0: none, 1: wechat, 2: instagram
    }
response:
    {
        "success": true,
        "message": "login succeed",
        "userId": "5d4fed4c6f312d1eb4fcf115",
    }

3. User upload image
POST /api/user/image?userId=openId&source=1
//source: 0: none, 1: wechat, 2: instagram
request:
    Form data
    {
        image: FILE
    }
response:
    {
        "success": true,
        "imageId": "4uEuxOCpSwxhoccvKiplILmuw2NTZJSn",
        "imageUrl": "public/images/2z0r7a6KsGtj8SeF-1565603126722.JPG",
        "message": "Image uploading succeed."
    }

4. get user's images. This endpoint is used to get all of the user's images and all reviewed images.
GET /api/user/images/list?userId=user1&source=2&pageNumber=0&pageSize=20
response:
    {
        "success": true,
        "images": [
                {
                        "userSource": "" //0: none, 1: wechat, 2: instagram
                        "userName": "" 
                        "url": "public/uploads/lEA72K6X0gRunviT-1565522724373.JPG",
                        "imageId": "",
                        "status": "", //1:new, 2:viewed, 3:captioning, 4:captioned, 5:deleted
                        "caption": ""
                }
        ]
    }

5. get image details
GET /api/image/imageId?userId=openId
response:
    {
        "success": true,
        "image" : {
                        "url": "public/uploads/lEA72K6X0gRunviT-1565522724373.JPG",
                        "imageId": "",
                        "status": "", //new, viewed, captioning, captioned, deleted
                        "caption": ""
                }
    }

6. get all images, this endpoint should be called only by admin
GET /images/list?userId=adminUser&pageNumber=0&pageSize=20
header:
    token: predefined password //do we need this?
response:
    {
        "success": true
        "images": [
                    {
                        "userSource": "" //0: none, 1: wechat, 2: instagram
                        "userName": "" // need this?
                        "url": "/image.xxx",
                        "imageId": "",
                        "caption": "",
                        "status": ""
                    },
                    {
                    }
                ]               
    }

7. get user count, image count
GET /api/users/info?userId=adminUser
header:
    token: predefined password
response:
    {
        "succes": true,
        "userCount": 5,
        "imageCount: 5
    }

8. update image // used to review image and delete image
PUT /api/images/update?userId=adminUser
header:
    token: predefined password ??
request:
        {
            "images": [
                        {
                            "imageId": "",
                            "status": "" //1:new, 2:viewed, 3:captioning, 4:captioned, 5:deleted
                        }
                    ] 
        }
response:
        {
            "success": true
        }
