const config = require("../config.js");
const mongoose = require("mongoose");

try {
  mongoose
    .connect(process.env.MONGODB_URI || config.connectionString)
    .then(() => console.log(`MongoDB connected Successfully!`));
} catch (error) {
  console.log(`MongoDB Error: `, error.message);
  process.exit(1);
}

mongoose.Promise = global.Promise;

module.exports = {
  User: require("../models/user"),
};
