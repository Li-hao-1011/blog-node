const env = process.env.NODE_ENV // 环境参数

// mySQL
let MYSQL_CONF
// redis
let REDIS_CONF

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'Lh3306+-@',
    port: '3306',
    database: 'myblog'
  }

  REDIS_CONF = {
    prot: 6379,
    host: '127.0.0.1'
  }
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'Lh3306+-@',
    port: '3306',
    database: 'myblog'
  }

  REDIS_CONF = {
    prot: 6379,
    host: '127.0.0.1'
  }
}

module.exports = { MYSQL_CONF, REDIS_CONF }
