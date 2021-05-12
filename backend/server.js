const app = require("./app");
require("dotenv").config();
const connectDatabase = require("./config/database");
const cloudinary = require('cloudinary')


process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to uncaught exceptions");
  process.exit(1);
});

const port = process.env.port || 8000;


const server = app.listen(port, () => {
  console.log(
    `Server started at port ${port} in ${process.env.NODE_ENV} environment`
  );
  connectDatabase();

  cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
});


process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to unhandle promise rejected");
  server.close(() => {
    process.exit(1);
  });
});
