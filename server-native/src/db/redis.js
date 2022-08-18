const redis = require('redis')

const { REDIS_CONF } = require('../conf/db')

const redisClient = redis.createClient(REDIS_CONF)

redisClient.on('error', (err) => {
  console.error('redisClient Error: ', err)
})

function set(key, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  redisClient.set(key, value, redis.print)
}
function get(key) {
  redisClient.get(key, redis.print)
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      if (val == null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      } catch (err) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  set,
  get
}
