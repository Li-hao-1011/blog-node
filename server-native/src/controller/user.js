const { exec, escape } = require("../db/mysql");
const { genPassword } = require("../utils/crpy");

const login = (username, pwd) => {
  username = escape(username);
  // 生成加密密码
  // pwd = genPassword(pwd);
  console.log("生成加密密码"), pwd;
  pwd = escape(pwd);

  const sql = `select name, realname from users where name=${username} and password=${pwd}`;

  return exec(sql).then((res) => {
    return res[0] || {};
  });
};

module.exports = { login };
