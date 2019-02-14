const AWS = require('aws-sdk');
const fs = require('fs');
const sharp = require('sharp');

const formPromise = require('./formidablePromise');

AWS.config.region = 'ap-northeast-2';

const uploadFile = async req => {
  const { err, files, fields } = await formPromise(req);
  if (err) throw new Error(err);

  const promises = Object.keys(files).map(async fileKey => {
    const randomNum = Math.floor(Math.random() * 1000000);
    const s3 = new AWS.S3();
    await sharp(files[fileKey].path)
      .rotate()
      .toFile(`/home/ubuntu/${files[fileKey].name}`);
    const params = {
      Bucket: 'dreamary',
      Key: randomNum + files[fileKey].name,
      ACL: 'public-read',
      Body: fs.createReadStream(`/home/ubuntu/${files[fileKey].name}`)
    };
    const data = await s3.upload(params).promise();

    fs.unlink(files[fileKey].path);
    fs.unlink(`/home/ubuntu/${files[fileKey].name}`);
    return data.Location;
  });

  const fileLocations = await Promise.all(promises);
  return fileLocations;
};

module.exports = { uploadFile };
