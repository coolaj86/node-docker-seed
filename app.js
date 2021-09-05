"use strict";

let app = require("@root/async-router").Router();

if ("DEVELOPMENT" === process.env.ENV) {
  // set special options
  console.info("ENV=" + process.env.ENV);
}

app.get("/", async function (req, res) {
  res.end(
    `GET /
GET /hello
GET /errors/400
GET /errors/404
GET /errors/500
`
  );
});

app.get("/hello", async function (req, res) {
  res.json({
    message: "Hello, World!",
    env: process.env.ENV || "",
    port: process.env.PORT || 0,
  });
});

app.get("/errors/400", async function (req, res) {
  let err = new Error("BAD REQUEST");
  err.code = "E_BAD_REQUEST";
  err.status = 400;
  err.details = "Yeah, it's your fault";
  throw err;
});

app.get("/errors/500", async function (req, res) {
  throw Error("some rando error");
});

app.get("/errors/404", async function (req, res, next) {
  next();
});

// TODO error handler for /api
app.use("/", async function (err, req, res, next) {
  if (err.status >= 400 && err.status < 500) {
    res.statusCode = err.status || 500;
    res.json({ status: err.status, code: err.code, message: err.message });
    return;
  }

  err.id = require("crypto").randomBytes(3).toString("hex");
  console.error("Unexpected Error:");
  console.error(err);
  res.statusCode = err.status || 500;
  res.end(`Internal Server Error: #${err.id}\n`);
});

if (require.main === module) {
  require("dotenv").config();

  let http = require("http");
  let express = require("express");
  let server = express().use("/", app);

  let port = process.env.PORT || 3042;
  http.createServer(server).listen(port, function () {
    /* jshint validthis:true */
    console.info("Listening on", this.address());
  });
}

module.exports = app;
