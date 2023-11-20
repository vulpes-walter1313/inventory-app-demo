const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const productsRouter = require("./routes/products");
const compression = require("compression");
const helmet = require("helmet");

const app = express();

// Setting up mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : process.env.MONGODB_DEV_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  const RateLimit = require("express-rate-limit");
  const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50,
  });
  app.use(limiter);
}

app.use("/", indexRouter);
app.use("/category", categoryRouter);
app.use("/product", productsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
