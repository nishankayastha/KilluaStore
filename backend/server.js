const app = require("./app");
require("dotenv").config();
const connectDatabase = require("./config/database");

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
});

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to unhandle promise rejected");
  server.close(() => {
    process.exit(1);
  });
});
