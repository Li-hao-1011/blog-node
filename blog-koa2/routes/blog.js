const router = require("koa-router")();
const {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const loginCheck = require("../middleware/loginCheck");
const { ErrorModel, SuccessModel } = require("../model/resModel");

router.prefix("/api/blog");

router.get("/list", async (ctx, next) => {
  /*   console.log("中间件");
  ctx.body = {
    errno: 0,
    data: '测试 /api/blog/list'
  }; */

  let author = ctx.query.author || "";
  const keyword = ctx.query.keyword || "";

  if (ctx.query.isadmin) {
    // 管理员界面
    if (ctx.session.username == null) {
      // 未登录
      ctx.body = new ErrorModel("未登录");
      return;
    }
    author = ctx.session.username;
  }

  const listData = await getList(author, keyword);
  console.log("listData: ", listData);
  // const listData = await listResult;
  ctx.body = new SuccessModel(listData);
});

router.get("/detail", async (ctx, next) => {
  const detailData = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(detailData);

  /*   return detailResult.then((detailData) => {
    ctx.body = new SuccessModel(detailData);
  }); */
});

router.post("/new", loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username;
  const blogData = ctx.request.body;
  const data = await createBlog(blogData);
  ctx.body = new SuccessModel(data);
  /*   return newBlogResult.then((data) => {
    res.json(new SuccessModel(data));
  }); */
});

router.post("/update", loginCheck, async (ctx, next) => {
  const updateData = await updateBlog(ctx.query.id, ctx.request.body);
  if (updateData) {
    res.body = new SuccessModel();
  } else {
    res.body = new ErrorModel();
  }
  /*   return updateResult.then((updateData) => {
    if (updateData) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel());
    }
  }); */
});

router.post("/del", loginCheck, async (ctx, next) => {
  const result = await deleteBlog(ctx.query.id, ctx.session.username);
  if (result) {
    res.body = new SuccessModel();
  } else {
    res.body = new ErrorModel();
  }

  /*   return delResult.then((result) => {
    if (result) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel());
    }
  }); */
});

module.exports = router;
