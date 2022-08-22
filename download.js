var http = require("http");
var https = require("https");
var fs = require("fs");
const audios = require("./audios.json");
const { log } = require("console");

downloadAudio = async (audio) => {
  return new Promise((resolve, reject) => {
    const fileUrl = audio.thumbnail;
    const fileName = `${fileUrl}`.split("/").pop();
    const fileProtocol = fileUrl.split(":")[0];
    let file = fs.createWriteStream(`./files/${fileName}`);
    log(" downloading => ", fileName);
    let request;
    if (fileProtocol === "http") {
      request = http.get(fileUrl, function (response) {
        response.pipe(file);
        response.on("error", function (error) {
          log("audios error => ", error);
        });
        response.on("data", function (chunk) {
          log("audios chunk => ", fileName);
        });
        response.on("end", () => {
          log("audios downloaded => ", fileName);
        });
      });
    }
    if (fileProtocol === "https") {
      request = https.get(fileUrl, function (response) {
        response.pipe(file);
        response.on("error", function (error) {
          log("audios error => ", error);
        });
        response.on("data", function (chunk) {
          log("audios chunk => ", fileName);
        });
        response.on("end", () => {
          log("audios downloaded => ", fileName);
        });
      });
    }
    request.on("response", (res) => {
      resolve(res);
    });

    request.on("error", (err) => {
      reject(err);
    });
  });
};

exports.download = async () => {
  for (const audio of audios) {
    try {
      await downloadAudio(audio);
    } catch (error) {
      console.log("error ==> ", error);
    }
  }
};
