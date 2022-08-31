const { exec, escape } = require("../db/mysql");
const { genPassword } = require("../utils/crpy");

const login = async (username, pwd) => {
  username = escape(username);
  // 生成加密密码
  // pwd = genPassword(pwd);
  pwd = escape(pwd);

  const sql = `select name, realname from users where name=${username} and password=${pwd}`;
  const res = await exec(sql);
  console.log("res", res);
  return res[0] || {};

  /*   return exec(sql).then((res) => {
    return res[0] || {};
  }); */
};

module.exports = { login };
