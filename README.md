# node-docker-seed

A 'Hello World'-style Dockerized Node App

# Install

```bash
git clone git@github.com:coolaj86/node-docker-seed.git
```

```bash
pushd ./node-docker-seed
npm ci --only=production
```

# Configure

Copy [`example.env`](/example.env) and replace each of the ENVs with your local
development values (in `.env`), or the production values (in the Environment
Variable configuration for pipelines/actions in AWS, GitHub, etc)

```bash
rsync -avhP example.env .env
```

# Run

```bash
npm run start
```

# API

```txt
GET /
GET /hello
GET /errors/400
GET /errors/500
```

# Pre-reqs

```bash
# Get webi (and follow instructions)
curl https://webinstall.dev | bash
```

```bash
# Install Node
webi node@16

# For development
webi watchexec
```
