const fs =  require('fs')
const S3 = require('aws-sdk/clients/s3')

const s3 = new S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });


exports.uploadFile = (file, folder) => {
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer, 
        Key: file.originalname, 
        // ContentType: "image/jpeg",
        ACL: "public-read",
    };

    return s3.upload(uploadParams).promise();
};


exports.uploadImage = (file) => {
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer, 
        Key: file.originalname, 
        ContentEncoding: 'base64',
        // ContentType: file.mimetype,
        ACL: 'public-read'
    }

    return s3.upload(uploadParams).promise()
}

exports.deleteFile = (fileName, folder) => {
   // const fileStream = fs.createReadStream(file.path)

    const deleteParams = {
        Bucket: bucketName + folder,
        Key: fileName
    }

   /* s3.deleteObject(deleteParams, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log();                 // deleted
        });*/
        return s3.deleteObject(deleteParams).promise() 
}



// downloads a file from s3
exports.getFileStream = async (fileKey, folder) => {
    try {
        const downloadParams = {
            Key: fileKey,
            Bucket: bucketName + folder
        }
        const res = await s3.headObject(downloadParams).promise()
        console.log("File Found in S3", res)
        return s3.getObject(downloadParams).createReadStream()
    } catch (err) {
        console.log("File not Found ERROR : " + err.code)
        return false

    }


}
