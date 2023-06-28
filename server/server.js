const express = require("express");
const multer = require("multer");
require("dotenv").config();
const app = express();
const AWS = require("aws-sdk");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
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

//Get Summary
async function generateSummary(transcript) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Make A Summary"${transcript}"`,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,


    });

    return summary = completion.data.choices

  } catch (error) {
    console.error('Error:', error);
  }
}

//Get Transcripts
async function getJsonFileFromS3(filename) {
  const s3 = new AWS.S3();
  const jsonKey = `transcripts/${filename}-transcript.json`;
  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: jsonKey,
    };

    const response = await s3.getObject(getObjectParams).promise();

    const jsonContent = JSON.parse(response.Body.toString());
    const transcript = jsonContent.results.transcripts[0].transcript;
    const summary = generateSummary(transcript);
    return summary;
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "File Not Found",
    });
  }
}

app.get("/transcripts", async (req, res) => {
  const { files } = req.query;

  // console.log(files);
  try {
    const transcripts = await getJsonFileFromS3(files);
    res.json(transcripts);

  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed to retrive Transcripts JSON",
    });

  }
});


app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
