const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]

  // 登录
  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body
    // const { username, password } = req.query
    console.log('登录', username, password)
    const userResult = login(username, password)

    return userResult.then((data) => {
      if (data.name) {
        req.session.username = data.name
        req.session.realname = data.realname
        // 同步redis
        set(req.sessionId, req.session)

        return new SuccessModel('登陆成功')
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  // 登录验证测试
  /*   if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel({
          session: req.session
        })
      )
    } else {
      return Promise.resolve(new ErrorModel('尚未登录'))
    }
  } */
}

module.exports = handleUserRouter
