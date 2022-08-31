const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login } = require("../controller/user");

const router = require("koa-router")();

router.prefix("/api/user");

router.post("/login", async (ctx, next) => {
  /*   const { username, password } = ctx.request.body;
  const data = await login(username, password);
  if (data.name) {
    // 设置 session
    ctx.session.username = data.username;
    ctx.session.realname = data.realname;

    ctx.body = new SuccessModel("成功");

    console.log("data", data);

    return;
  }
  ctx.body = new ErrorModel("登录失败"); */

  const body = ctx.request.body;
  const { username, password } = body;

  const data = await login(username, password);
  console.log("/login", body);
  if (data.name) {
    ctx.session.username = data.name;
    ctx.session.realname = data.realname;
    const cb = () => {
      console.log("ctx.body   登陆成功");
      return new SuccessModel("登陆成功");
    };
    ctx.body = cb();
    console.log("登陆成功 ,,,", data);
  } else {
    const cb = () => {
      console.log("ctx.body   登录失败了啊");
      return new ErrorModel("登录失败了啊");
    };
    ctx.body = cb();
  }
});

/* router.get("/session-test", async (ctx, next) => {
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0;
  }
  ctx.session.viewCount++;

  ctx.body = {
    error: 0,
    viewCount: ctx.session.viewCount,
  };
}); */

module.exports = router;
