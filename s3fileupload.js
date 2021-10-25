const AppError = require('../helper/appError');
const dbConnection = require("../models");
const multer = require("multer");
const multerS3 = require("multer-s3");
const CONFIG = require('../config/config_' + [process.env.NODE_ENV || 'local'] + '.json');
const BUCKET_NAME = CONFIG.BUCKET_NAME;
const s3 = require("../helper/awsCredential")

const upload = (user) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        console.log("files====>>>>>", file);
        cb(null, {fieldName: file.fieldname});
      },
      contentType: function (req, file, cb) {
        cb(null, file.mimetype);
      },
      key: function (req, file, cb) {
        cb(null, user + "/" + file.originalname);
      }
    })
  })
}
const singleUpload = upload('user').single('image');
exports.uploadFile = (req, res) => {
  singleUpload(req, res, function (err) {
    const uploadObj = {};
    uploadObj.location = req.file.location;
    dbConnection.Aws.create(uploadObj).then(uploadRes => {
      res.send(uploadRes)
    }).catch(function (err) {
      console.log(err)
    })
  })
}
const multipleUpload = upload('users').array('photos', 10)
exports.uploadMultiFile = (req, res) => {
  multipleUpload(req, res, function (error) {
    let fileArray = req.files,
      fileLocation;
    const images = [];
    for (let value of fileArray.length) {
      fileLocation = fileArray[value].location;
      console.log('filenm====>>>', fileLocation);
      images.push(fileLocation)
    }
    return res.status(200).json({
      status: 'ok',
      filesArray: fileArray,
      locationArray: images
    });
  })
}
