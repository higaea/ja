const _ = require('lodash');
const OSS = require('ali-oss');
const fs = require('fs');


function AliOssClient({ bucket, region }) {
    if (!(this instanceof AliOssClient)) {
      return new AliOssClient();
    }
  
    this.client = new OSS({
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
      bucket,
      region,
    });
  }

  const ossClient = new OssClient({ bucket: 'your-bucket-name', region: 'your-bucket-region (e.g. "oss-us-west-1")' });