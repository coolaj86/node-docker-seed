"use strict";

require("dotenv").config({ path: ".env" });

let http = require("http");
let express = require("express");
let app = require("./app.js");
let server = express().use("/", app);

if (!process.env.ENV) {
  console.error(
    [
      "ERROR: Failed to read ENVs",
      "Please read the README and set the appropriate ENVs in either:",
      "\t.env (for local dev)",
      "\tenvironment variables (for production deployment, docker, AWS, GitHub, etc)",
      "",
    ].join("\n")
  );
  process.exit(1);
}

let port = process.env.PORT || 3042;
let httpServer = http.createServer(server).listen(port, function () {
  console.info("Listening on", httpServer.address());
});
