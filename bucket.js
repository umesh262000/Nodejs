const AppError=require('../helper/appError')
const AWS=require("aws-sdk")
const CONFIG = require('../config/config_' + [process.env.NODE_ENV || 'local'] + '.json');
const ID=CONFIG.ID;
const SECRET=CONFIG.SECRET;
const BUCKET_NAME=CONFIG.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set our region 
        LocationConstraint: "eu-west-1"
    }
};

s3.createBucket(params, function(err, data) {
    if (err){ 
        throw new AppError(err)
    }
    else{
         console.log('Bucket Created Successfully', data.Location);
    }
});

module.exports=s3
