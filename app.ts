import createError from "http-errors";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "node:http";
import "dotenv/config";

import indexRouter from "./routes/index";
import categoryRouter from "./routes/category";
import productsRouter from "./routes/products";
import apiRouter from "./routes/api";
import compression from "compression";
import helmet from "helmet";
import HttpError from "./lib/HttpError";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'"],
        defaultSrc: ["'self'"],
      },
    },
  }),
);
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
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// serve app
const PORT = parseInt(process.env.PORT || "3000");
app.set("port", PORT);
const server = http.createServer(app);
server.listen(PORT);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: Error & { syscall?: string; code?: string }) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.log("Listening on " + bind);
}

module.exports = app;
