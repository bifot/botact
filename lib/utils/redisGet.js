module.exports = (redis) => (key) => {
  return new Promise((resolve, reject) => {
    return redis.get(key, (err, reply) => {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  })
}
