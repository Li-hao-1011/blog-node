const {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { ErrorModel, SuccessModel } = require("../model/resModel");

const handleBlogRoute = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];

  const id = req.query.id ?? "";

  // 统一的登录验证函数
  const loginCheck = (req) => {
    if (!req.session.username) {
      return Promise.resolve(new ErrorModel("尚未登录"));
    }
  };

  // GET
  if (method === "GET") {
    switch (path) {
      case "/api/blog/list":
        let author = req.query.author ?? "";
        const keyword = req.query.keyword ?? "";

        if (req.query.isadmin) {
          const loginCheckResult = loginCheck(req);
          if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
          }
          author = req.session.username;
        }

        const listResult = getList(author, keyword);
        console.log("/api/blog/list", listResult);
        return listResult.then((listData) => {
          console.log("/api/blog/list", listData);
          return new SuccessModel(listData);
        });
      // return new SuccessModel(listData);
      case "/api/blog/detail":
        const detailResult = getDetail(id);
        return detailResult.then((detailData) => {
          return new SuccessModel(detailData);
        });
    }
  }

  // POST
  if (method === "POST") {
    const loginCkeckResult = loginCheck(req);

    switch (path) {
      case "/api/blog/new":
        if (loginCkeckResult) {
          // 未登录
          return loginCkeckResult;
        }

        req.body.author = req.session.username;
        const blogData = req.body;
        const newBlogResult = createBlog(blogData);
        return newBlogResult.then((data) => {
          return new SuccessModel(data);
        });
      case "/api/blog/update":
        if (loginCkeckResult) {
          // 未登录
          return loginCkeckResult;
        }
        const updateResult = updateBlog(id, req.body);
        return updateResult.then((updateData) => {
          console.log(updateData);
          if (updateData) {
            return new SuccessModel();
          } else {
            return new ErrorModel();
          }
        });
      case "/api/blog/del":
        if (loginCkeckResult) {
          // 未登录
          return loginCkeckResult;
        }
        const delResult = deleteBlog(id, req.session.username);
        return delResult.then((res) => {
          return res ? new SuccessModel() : new ErrorModel();
        });
    }
  }
};

module.exports = handleBlogRoute;
