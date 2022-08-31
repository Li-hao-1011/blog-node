const router = require("koa-router")();

router.prefix("/users");

router.post("/", function (ctx, next) {
  console.log("/users");

  ctx.body = "this is a users response!";
});

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response";
});

module.exports = router;
