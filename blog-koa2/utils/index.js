// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  // toGMTString cookie 过期时间格式
  return d.toGMTString()
}

module.exports = getCookieExpires
