require("dotenv").config();
require("rootpath");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const errorHandler = require("./lib/errorHandler");

const apiRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(cors());

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(errorHandler);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
