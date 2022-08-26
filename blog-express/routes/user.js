var express = require("express");
var router = express.Router();
const { ErrorModel, SuccessModel } = require("../model/resModel");
const { login } = require("../controller/user");
const { set } = require("../db/redis");

router.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  const userResult = login(username, password);

  return userResult.then((data) => {
    console.log("data:", data);
    if (data.name) {
      req.session.username = data.name;
      req.session.realname = data.realname;
      // 同步redis
      // set(req.sessionId, req.session);
      res.json(new SuccessModel("登陆成功"));
    } else {
      res.json(new ErrorModel("登录失败了啊"));
    }
  });
});

router.get("/login-test", (req, res, next) => {
  if (req.session.username) {
    res.json({
      errno: 0,
      msg: "登录成功",
    });
  } else {
    res.json({ errno: -1, msg: "未登录" });
  }
});

router.get("/session-test", (req, res, next) => {
  const session = req.session;
  if (session.viewNum == null) {
    session.viewNum = 0;
  }
  session.viewNum++;
  res.json({
    viewNum: session.viewNum,
  });
});

module.exports = router;
