const request = require('request');

var imageUrl = 'https://cs.stanford.edu/people/karpathy/neuraltalk2/imgs/';
for(let i = 90; i < 95 ; i++) {
    let imageName = 'img' + i + '.jpg';
    request.post(
        {
            uri:'http://localhost:8080/api/caption',
            body: {url: imageUrl + imageName},
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidTEiLCJpYXQiOjE1NjU0ODI2NjUsImV4cCI6MTU2NTU2OTA2NX0.hkHoQhZBOjH8evyC8KecKS6qVXZXapB4K_5MBr86mwbx2iyaQPnmc61WTI8K-c0ZHMQG2uYSEEADZ9MU-6LcivvMNnSOBdjBF5Bft48M_iP1WIqjfSgcSd5njlzg-tYX32xVVmOU4rS4QnT0SEQAEMv9pAhniooV2j-zVJGnoAi9Fkn0kfQaUvkDZmrKHzbOxdsTyyigrtGdJkKrtEdHm0Ud9gxYuA6dhYERHCmET7tiryFDq0zlYiT2Znuv9OOBzYxP_297ULBO1Q49pkafsawmeHQQ_3T3wBQuuAN6H5ygoSDH0DyPOi6sw8Kytq6J1WQStZ9jDiFXNRRc_VUECg'
            },
            json: true
        }, 
        (err, resp) => {
            console.log(resp.body);
        } 
    );
}