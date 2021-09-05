"use strict";

let app = require("@root/async-router").Router();
let Keyfetch = require("keyfetch");
let request = require("@root/request");

if ("DEVELOPMENT" === process.env.ENV) {
  // set special options
  console.info("ENV=" + process.env.ENV);
}

function Err({ message, code, status, details }) {
  let err = new Error(message);
  err.code = code;
  err.status = status;
  err.details = details;
  return err;
}

app.use("/", function (req, res, next) {
  // use a debug / pretty print json
  res.json = function (data) {
    res.setHeader("Content-Type", "application/json");
    let json = JSON.stringify(data, null, 2);
    res.end(json + "\n");
  };
  next();
});

app.get("/", async function (req, res) {
  res.end(
    `GET /
GET /hello
GET /envs
GET /oidc/config
GET /oidc/inspect
GET /oidc/profile
GET /errors/400
GET /errors/404
GET /errors/500
`
  );
});

app.get("/hello", async function (req, res) {
  res.json({
    message: "Hello, World!",
  });
});

app.get("/envs", async function (req, res) {
  res.json({
    env: process.env.ENV || "",
    port: process.env.PORT || 0,
  });
});

app.use("/oidc", decodeClaims);

app.get("/oidc/inspect", async function (req, res) {
  res.json(req.jws);
});

app.get("/oidc/config", getConfig, async function (req, res) {
  res.json(req.oidcConfig);
});

app.get("/oidc/profile", getConfig, async function (req, res) {
  if (!req.oidcConfig.userinfo_endpoint) {
    throw Err({
      message:
        "OpenID Configuration is mising userinfo_endpoint - try inspecting with /oidc/config",
      status: 422,
      code: "E_BAD_REMOTE",
    });
  }

  let resp = await request({
    url: req.oidcConfig.userinfo_endpoint,
    headers: { Authorization: "Bearer " + req.jwt },
    json: true,
  })
    .then(mustOk)
    .catch(function (err) {
      console.error(`Could not get '${req.oidcConfig.userinfo_endpoint}':`);
      console.error(err);
      throw Err({
        message:
          "could not fetch OpenID Configuration - try inspecting the token and checking 'iss'",
        status: 422,
        code: "E_BAD_REMOTE",
      });
    });

  res.json(resp.body);
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
  err.id = require("crypto").randomBytes(3).toString("hex");

  if (err.status >= 400 && err.status < 500) {
    res.statusCode = err.status || 500;
    res.json({ status: err.status, code: err.code, message: err.message });
    return;
  }

  console.error("Unexpected Error:");
  console.error(err);
  res.statusCode = err.status || 500;
  res.json({ message: `Internal Server Error: #${err.id}\n`, id: err.id });
});

async function decodeClaims(req, res, next) {
  let token = (req.headers["authorization"] || "").split(" ")[1];
  if (!token) {
    throw Err({
      message:
        "missing token header, example: 'Authorization: Bearer xxxx.yyyy.zzzz'",
      code: "E_MISSING_AUTHORIZATION",
      status: 401,
    });
  }

  req.jwt = token;
  req.jws = await Keyfetch.jwt.decode(token);
  req.claims = req.jws.claims;
  next();
}

async function mustOk(resp) {
  if (resp.statusCode >= 200 && resp.statusCode < 300) {
    return resp;
  }
  throw Err({
    message: "remote server gave a non-OK response",
    code: "E_BAD_GATEWAY",
    status: 502,
    details: resp.body,
  });
}

async function getConfig(req, res, next) {
  if (!req.claims.iss) {
    let err = new Error(
      "token should have an 'iss' claim, which should be a URL at which /.well-known/openid-configuration can be found"
    );
    err.code = "E_NO_ISSUER";
    err.status = 422;
    return err;
  }

  let oidcUrl = req.claims.iss.toString();
  if (!oidcUrl.endsWith("/")) {
    oidcUrl += "/";
  }
  oidcUrl += ".well-known/openid-configuration";

  // See examples:
  // Google: https://accounts.google.com/.well-known/openid-configuration
  // Auth0: https://example.auth0.com/.well-known/openid-configuration
  // Okta: https://login.writesharper.com/.well-known/openid-configuration
  let resp = await request({ url: oidcUrl, json: true })
    .then(mustOk)
    .catch(function (err) {
      console.error(`Could not get '${oidcUrl}':`);
      console.error(err);
      throw Err({
        message:
          "could not fetch OpenID Configuration - try inspecting the token and checking 'iss'",
        status: 422,
        code: "E_BAD_REMOTE",
      });
    });

  req.oidcConfig = resp.body;
  next();
}

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
