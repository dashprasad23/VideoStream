const express = require("express");
const app = express();
// const fs = require("fs");
// const axios = require("axios");
// const buffer = require("buffer");
// const http = require("https");
// const { request } = require("http");
const request = require("request");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", async (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Require Range header");
  }
  const videoSize = 98991296;
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.split("=")[1].split("-")[0]);
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;

  request(
    {
      url: "https://s3.amazonaws.com/pgrrec100/45720882/374a6b53-3b58-472a-b664-b52e1c358a49/archive.mp4",
      method: "HEAD",
    },
    function (error, response, body) {
      res.writeHead(206, {
        "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      });
      pipeToResponse();
    }
  );

  function pipeToResponse() {
    var options = {
      url: "https://s3.amazonaws.com/pgrrec100/45720882/374a6b53-3b58-472a-b664-b52e1c358a49/archive.mp4",
      headers: {
        range: "bytes=" + start + "-" + end,
        connection: "keep-alive",
      },
    };

    request(options).pipe(res);
  }
});

app.listen(8000, () => {
  console.log("listening on port 8000");
});
