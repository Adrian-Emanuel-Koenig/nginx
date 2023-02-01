const config = require("dotenv").config;
config();

const mongoose = require("mongoose");
const connect = mongoose.connect;

mongoose.set("strictQuery", true);

async function connection() {
  try {
    await connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB Atlas"))
      .catch((error) => console.error(error));
  } catch (error) {
    console.log(error);
    throw "can not connect to the db";
  }
}

module.exports = {
  connectionMDB: connection()
  };