const express = require("express");
const multer = require("multer");
require("dotenv").config();
const app = express();
const AWS = require("aws-sdk");

const port = process.env.PORT;

//AWS Credentials
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_DEFAULT_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

//AWS config
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post("/upload", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files Were Uploaded");
  }

  const s3 = new AWS.S3();
  const uploads = req.files.map((file) => {
    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: file.buffer,
    };

    return s3.upload(params).promise();
  });

  try {
    const data = await Promise.all(uploads);
    data.forEach((res) => {
      console.log("File Upload Success");
    });
  } catch (error) {
    console.error("File Upload Failed", error);
  }
});

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
