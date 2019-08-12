1. user signup
POST /api/user/signup
request:
    Content-Type: application/x-www-form-urlencoded
    {
        name: String
        password: String
        role: //user:0, admin:1
    }
response:
    {
    "success": true,
    "uid": uid,
    "token": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InU1IiwidXNlcklkIjoiVlRQRVhqMlJFVFFsWG12c2pSUGVvaWpmM096ekxjWG8iLCJpYXQiOjE1NjU2MDc3MjgsImV4cCI6MTU2NTY5NDEyOH0.NMRMwajp76PmKA6YANpj1YXZWIdaCpSJfFxLy7X7U5z0g5fVZ1yo7kiHS-MyXRptcbtz-lMzq4OKRvXNDCgNO2VFx1TIMrBQukS2yWG-b4JzLMKVt43dBCvvqIVMP5ySeR0rW01Mal_-Sbl7n5V44tmDQeTOTGfHaTowTh3fzLXp587O6m58yRUVPKfqh7x-OMpmUz9r4OXMKgiRxkHuAxT9usvFMgC4dtVQuGcSm-v2R9xP1QG7DOHD2vY3v4C_QKFNLwwp8Gh9-wDWR4PVZLdJ16uhmQsVlGy4rIEAlAfOPacfZXa7Ro07d7W4EYWwMt-UXU-n8B1CyKcxuQvAFg"
}

2. user login
GET /api/user/login
request:
    {
        name: String
        password: String
    }
response:
    {
        "success": true,
        "message": "login succeed",
        "userId": "5d4fed4c6f312d1eb4fcf115",
        "token": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InU1IiwidXNlcklkIjoiTVl2c2FJUE52U0laMU9obXhLdGxNZlhNTHRpcEcwZUUiLCJpYXQiOjE1NjU2MDAyNjgsImV4cCI6MTU2NTY4NjY2OH0.oTf-6sNfact43lDQQB7-jHKdIWo7eeMxr2TlnB5p-o4cTOSlWeJBPHTyXm1DgyTuZ8v0g96JsdEBH_C6AcXfIai1bACE5TYPHdnVtV78Q6Ig4PCakd_UOlCKRizL_vXmk4VW3N-8qc49h3nmc_bAQ7EhY4duQDDTejaK3or-ag_K_40_4tufuCXXrW7qhrQDNRUP3WY54-3xq44jk10nLIz70hdX_5NHpqq_2suDzN1pcyv7sAK7YdokKl2whDxS21mfJTrdPpyDzD5pSeQGu8NZpY1I4sykwEj4zI1hJ2Q82bctJHPfBPqh1N2r0zJp0lkuQ37NrjdWhuGOyO20ow"
    }

3. User upload image
POST /api/user/image?uid=MYvsaIPNvSIZ1OhmxKtlMfXMLtipG0eE
header:
    Authorization: token
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

4. get user's images
GET /api/user/imageslist?uid=MYvsaIPNvSIZ1OhmxKtlMfXMLtipG0eE&pageNumber=0&pageSize=20
header:
    Authorization: token
response:
    {
        "success": true,
        "urls": [
            "public/uploads/lEA72K6X0gRunviT-1565522724373.JPG"
        ]
    }

5. get image details
GET /api/image/imageId
header:
    Authorization: token
response:
    {
        "success": true,
        "image" : {
            "url": url
            "caption": String
            ...
        }
    }

6. get images
GET /image/list?&pageNumber=0&pageSize=20
header:
    Authorization: token //admin
response:
    {
        "success": true
        [
            {
                "url": "/image.xxx",
                "uid": "",
                "status": ""
            }, 
            {
            }
    }

7. get user count
GET /api/user/count
header:
    Authorization: token //need admin user
response:
    {
        "succes": true,
        "count": 5
    }

8. get image count
GET /api/image/count
header:
    Authorization: token //need admin user
response:
    {
        "succes": true,
        "count": 5
    }
