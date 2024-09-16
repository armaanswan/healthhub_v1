const express = require("express");
const cors = require("cors");
const app = express();
const indexRoutes = require("./routes/index");

app.use(express.json());
app.use(cors());

app.use("/", indexRoutes);

module.exports = app;
