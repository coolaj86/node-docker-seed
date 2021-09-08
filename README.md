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

GET /envs

GET /oidc/config
Auhorization: Bearer <token>

GET /oidc/inspect
Auhorization: Bearer <token>

GET /oidc/profile
Auhorization: Bearer <token>

GET /errors/400

GET /errors/500
```

## Example

```bash
MY_TOKEN=eyJraWQiOiJEa1lUbmhTdkd5OEJkbk9yMVdYTENhbVFRTUZiNTlYbHdBWVR2bVg5ekxNIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmRNcmJJc1paTWtMR0FyN1gwRVNKdmdsX19JOFF4N0pwQlhrVjV6ZGt5bk0iLCJpc3MiOiJodHRwczovL2xvZ2luLndyaXRlc2hhcnBlci5jb20iLCJhdWQiOiJodHRwczovL2dlbmVyaWNvaWRjLm9rdGFwcmV2aWV3LmNvbSIsInN1YiI6IjBvYXI5NXp0OXpJcFl1ejZBMGg3IiwiaWF0IjoxNTg4MTg1NDU3LCJleHAiOjE1ODgxODkwNTcsImNpZCI6IjBvYXI5NXp0OXpJcFl1ejZBMGg3Iiwic2NwIjpbIm9rdGEudXNlcnMubWFuYWdlIl19.TrrStbXUFtuH5TemMISgozR1xjT3rVaLHF8hqnwbe9gmFffVrLovY-JLl63G8vZVnyudvZ_fWkOBUxip1hcGm80KvrSgpdOp9Nazz-mjkP6T6JwslRFHDe8SC_4h2LG9zi5PV9y3hAayBK51q1HIwgAxl_2F7q4l0jLKDFsWjQS8epNaB05NLI12BDvO-C-7ZGGJ4EQfGS9EjN9lS-vWnt_V3ojTL0BJCKgL5Y0c9D2VkSqVN4j-7BSRZt0Un3MAEgznXmk2ecg3y7s9linGR0mC3QqKeyDfFNdsUJG6ac0h2CFFZQizpQu1DFmI_ADKmzxVQGPICuslgJFFoIF4ZA
export MY_TOKEN
```

```bash
curl http://localhost:3000/oidc/inspect \
  -H "Authorization: Bearer ${MY_TOKEN}"
```

For an example of how to generate a valid token for testing see:

- Okta:
  [Get an access token](https://developer.okta.com/docs/guides/implement-oauth-for-okta-serviceapp/get-access-token/#make-a-request)

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
docker build -t node-docker-seed .

docker container run --name my-app --env PORT=3080 -p 3000:3080 node-docker-seed
```

Management and cleaning up:

```bash
# remove the image
docker image ls
docker image rm node-docker-seed

# remove the container
docker container list
docker container rm my-app
```

Stop the container:

```bash
docker container stop my-app
```

Or, for a stubborn container:

```bash
docker container kill my-app
```
