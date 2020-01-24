const Assert = require('assert');
const { Writable } = require('stream');
const Aws = require('aws-sdk');

exports.S3 = new Aws.S3();

exports.fetchFileAsReadable = (bucket, key) => {

    Assert(bucket && key, '"bucket" and "key" parameters must be defined');
    return exports.S3.getObject({ Bucket: bucket, Key: key}).createReadStream();
}

exports.uploadFileAsWritable = (bucket, key, writable) => {

    Assert(bucket && key, '"bucket" and "key" parameters must be defined');
    Assert(writable instanceof Writable, '"writable" must be an instance of stream.Writable class');
    return exports.S3.upload({
        Bucket: bucket, Key: key, Body: writable, ACL: 'private'
    }).promise();
}
