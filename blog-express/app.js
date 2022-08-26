var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const fs = require("fs");

var blogRouter = require("./routes/blog");
var userRouter = require("./routes/user");
const RedisStore = require("connect-redis")(session);
const redisClient = require("./db/redis");
const { off } = require("process");

var app = express();

// 通过 morgan 打印日志
const ENV = process.env.NODE_ENV;
if (ENV !== "production") {
  app.use(logger("dev"));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a",
  });
  app.use(
    logger("combined", {
      stream: writeStream,
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = new RedisStore({
  client: redisClient,
});
app.use(
  session({
    secret: '"WJL_IHAO+-w@#"',
    cookie: {
      // path: "/", 默认配置
      // httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
  })
);

app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

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
