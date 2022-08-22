const fs = require("fs");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const audios = require("../files.json");
const { log } = require("console");

dotenv.config();

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const uploadAudio = async (audio) => {
  const fileUrl = audio.thumbnail;
  const fileName = `${fileUrl}`.split("/").pop();
  // Read content from the file
  const fileContent = fs.readFileSync(`../files/${fileName}`);

  // Setting up S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: fileName, // File name you want to save as in S3
    Body: fileContent,
  };

  log("uploading => ", fileName);
  // Uploading files to the bucket
  const result = await s3
    .upload(params)
    .promise()
    .then((res) => ({ ...audio, thumbnail: res.Location }))
    .catch((error) => log(`error => ${error}`));
  return result;
};

exports.uploadFiles = async () => {
  const newAudios = [];
  for (const audio of audios) {
    try {
      const newAudio = await uploadAudio(audio);
      newAudios.push(newAudio);
    } catch (error) {
      console.log("error ==> ", error);
    }
  }
  log("newAudios => ", newAudios);
  var jsonAudiosContent = JSON.stringify(newAudios);

  fs.writeFile("../newFiles.json", jsonAudiosContent, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
};
