const qs = require("querystring");

const getCookieExpires = require("./src/utils/index");
const userRouter = require("./src/router/user");
const blogRouter = require("./src/router/blog");
const { get, set } = require("./src/db/redis");
const { access } = require("./src/utils/log");

// 用于处理 post data
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (
      req.method !== "POST" ||
      req.headers["content-type"] !== "application/json"
    ) {
      resolve({});
      return;
    }

    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(postData);
    });
  });
};

// 存储session数据
// const SESSION_DATA = {}

const serverHandle = (req, res) => {
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers["user-agent"]
    } -- ${Date.now()}  `
  );

  // 设置返回格式
  res.setHeader("Content-type", "application/json");

  const url = req.url;
  req.path = url.split("?")[0];
  req.query = qs.parse(url.split("?")[1]);
  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    req.cookie[arr[0].trim()] = arr[1].trim();
  });

  // 解析 session
  let needSetCookie = false;
  let userId = req.cookie.userId;
  /*  if (userId) {
    console.log('有 userId', userId, req.session)
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
  } else {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  } */
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中的session
    set(userId, {});
  }
  req.sessionId = userId;
  get(req.sessionId)
    .then((sessionData) => {
      if (sessionData == null) {
        // 初始化 redis 中的 session 值
        set(req.sessionId, {});
        req.session = {};
      } else {
        req.session = sessionData;
      }
      // 处理 post data
      return getPostData(req);
    })
    .then((postData) => {
      try {
        req.body = JSON.parse(postData);
      } catch (err) {
        req.body = postData;
      }

      // 处理 blog路由
      const blogResult = blogRouter(req, res);
      if (blogResult) {
        blogResult.then((blogData) => {
          if (needSetCookie) {
            // 操作/设置 cookie
            // path=/ 根域名有效
            // httpOnly 只能后端修改cookie
            // expires 过期时间
            res.setHeader(
              "Set-Cookie",
              `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      // 处理 user路由
      const userResult = userRouter(req, res);
      if (userResult) {
        userResult.then((userData) => {
          if (needSetCookie) {
            res.setHeader(
              "Set-Cookie",
              `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
            );
          }
          console.log("处理 user路由", req.session);
          res.end(JSON.stringify(userData));
        });
        return;
      }

      // 404
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404 Not Fount\n");
      res.end();
    });

  /*   getPostData(req).then((postData) => {
    try {
      req.body = JSON.parse(postData)
    } catch (err) {
      req.body = postData
    }
    // 处理 blog路由
    const blogResult = blogRouter(req, res)
    if (blogResult) {
      blogResult.then((blogData) => {
        if (needSetCookie) {
          // 操作/设置 cookie
          // path=/ 根域名有效
          // httpOnly 只能后端修改cookie
          // expires 过期时间
          res.setHeader(
            'Set-Cookie',
            `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          )
        }
        console.log('处理blog路由', req.session)
        res.end(JSON.stringify(blogData))
      })
      return
    }

    const userResult = userRouter(req, res)
    if (userResult) {
      userResult.then((userData) => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          )
        }
        console.log('处理 user路由', req.session)
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 404
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 Not Fount\n')
    res.end()
  }) */
};

module.exports = serverHandle;
