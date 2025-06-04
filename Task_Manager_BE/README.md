## 🔬 Tech stack
- ✅**Backend**: [Nestjs](https://github.com/nestjs/nest)

## 📒 Documents
### Postman: [Postman](https://www.postman.com/cloudy-shuttle-270324/workspace/sma-be)

## 📀 Quick Start
### Prepare .env
- Copy .env_example
- Change the port/database url to your database url (not using the same database string with sma-AI)
### Prepare Service Account Credentials
#### Note: Use The Same Firebase Service Account Credentials
- Copy the Firebase Service Account Creadentials to Project Path and rename it to serviceAccountKey.json
### Install Requirements
1. Install Nestjs
```bash
$ npm i -g @nestjs/cli
```
2. Install Required Libary
```bash
$ pnpm install
```

### Set up the database
#### Before you start: 
- Deploy a MongoDB database first (can be self host or using [MongodbAtlas](https://www.mongodb.com/atlas/database))
- Remember to put database connection string into .env file
1. Generate Prisma Model
```bash
$ npx prisma generate
```

2. (Optional) Run once when connect to new database
```bash
$ npx prisma db push
```

### Running the app

```bash
$ pnpm run start
```

<div>
<img src= "https://firebasestorage.googleapis.com/v0/b/sma-be.appspot.com/o/readme_smabackend.md%2FScreenshot%202024-04-05%20at%2014.55.42.png?alt=media&token=7d65ac60-d13e-483e-aeb5-01627c9fcaef">
</div>

#### Swagger: [Tutorial](https://swagger.io/resources/webinars/getting-started-with-swagger/)
#### Backend Swagger Path: http://localhost:{Port}/{SwaggerEndpoint}
