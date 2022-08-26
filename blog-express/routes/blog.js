var express = require("express");
var router = express.Router();
const {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { INFO } = require("../db/redis");
const loginCheck = require("../middleware/loginCheck");
const { ErrorModel, SuccessModel } = require("../model/resModel");

router.get("/list", function (req, res, next) {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  if (req.query.isadmin) {
    // 管理员界面
    console.log('管理员');
    if (req.session.username == null) {
      // 未登录
      res.json(new ErrorModel("未登录"));
      return;
    }
    author = req.session.username;
  }

  const listResult = getList(author, keyword);
  return listResult.then((listData) => {
    res.json(new SuccessModel(listData));
  });
});

router.get("/detail", (req, res, next) => {
  const detailResult = getDetail(req.query.id);
  return detailResult.then((detailData) => {
    res.json(new SuccessModel(detailData));
  });
});

router.post("/new", loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const blogData = req.body;
  const newBlogResult = createBlog(blogData);
  return newBlogResult.then((data) => {
    res.json(new SuccessModel(data));
  });
});

router.post("/update", loginCheck, (req, res, next) => {
  const updateResult = updateBlog(req.query.id, req.body);
  return updateResult.then((updateData) => {
    if (updateData) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel());
    }
  });
});

router.post("/del", loginCheck, (req, res, next) => {
  const delResult = deleteBlog(req.query.id, req.session.username);
  return delResult.then((result) => {
    if (result) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel());
    }
  });
});

module.exports = router;
