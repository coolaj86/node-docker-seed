# node-docker-seed

A 'Hello World'-style Dockerized Node App

# Table of Contents

- API
- QuickStart
  - Install
  - Configure
  - Run
- DevOps
  - Local Development
  - Dockerizing

# API

This is a sample node app with just a few endpoints for demonstration.

```txt
GET /
GET /hello
GET /errors/400
GET /errors/500
```

# QuickStart

- Install
- Configure
- Run

## Install

```bash
git clone git@github.com:coolaj86/node-docker-seed.git
```

```bash
pushd ./node-docker-seed
npm ci --only=production
```

## Configure

Copy [`example.env`](/example.env) and replace each of the ENVs with your local
development values (in `.env`), or the production values (in the Environment
Variable configuration for pipelines/actions in AWS, GitHub, etc)

```bash
rsync -avhP example.env .env
```

## Run

```bash
npm run start
```

You'll see

```txt
Listening on { address: '::', family: 'IPv6', port: 3000 }
```

# DevOps

- Prerequisites
- Dockerizing

## Prerequisites

You'll need `node` and you may want `watchexec`:

```bash
# Get webi (and follow instructions)
curl https://webinstall.dev | bash
```

```bash
# Install Node
webi node@16
```

```bash
# For development
webi watchexec
```

To run the app, restarting on changes to `*.js` and `*.env` files:

```bash
watchexec -r -e js -e env -- npm run start
```

## Dockerizing

You can download docker **without registering** at
<https://www.docker.com/products/docker-desktop>.

Build the _image_, and the _container_, and run it:

```bash
docker image ls
docker image rm node-docker-seed
docker build -t node-docker-seed .

docker container list
docker container rm my-app
docker container run --name my-app --env PORT=3080 -p 3000:3080 node-docker-seed
```

Stop the container:

```bash
docker container stop my-app
```
