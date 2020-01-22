const Aws = require('aws-sdk');

exports.S3 = new Aws.S3();

exports.fetchFileAsReadable = (bucket, key) =>
    exports.S3.getObject({ Bucket: bucket, Key: key}).createReadStream();

exports.uploadFileAsWritable = (bucket, key, writable) =>
    exports.S3.upload({
        Bucket: bucket, Key: key, Body: writable, ACL: 'private'
    }).promise();
