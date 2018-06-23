const redis = require('redis')
const util = require('util')

module.exports = (redisConfig) => {
  const client = redis.createClient(redisConfig)
  const methods = {
    get: util.promisify(client.get).bind(client),
    set: util.promisify(client.set).bind(client),
    del: util.promisify(client.del).bind(client),
  }

  return {
    ...methods,
    get: async (key) => {
      const value = await methods.get(key)

      try {
        return JSON.parse(value)
      } catch (err) {
        return value
      }
    },
  }
}
