const mysql2 = require("mysql2");
const { MYSQL_CONF } = require("../conf/db");

const con = mysql2.createConnection(MYSQL_CONF);

con.connect();

// 执行sql的函数
function exec(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

module.exports = {
  exec,
  // 通过mysql自带函数 escape 处理参数，预防sql注入攻击
  escape: mysql2.escape,
};
