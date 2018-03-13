const { RedisClient, createClient, Multi } = require('redis')
const { promisifyAll } = require('bluebird')
const { Botact } = require('../')

promisifyAll(RedisClient.prototype)
promisifyAll(Multi.prototype)

const redis = createClient()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.GROUP_ID,
  token: process.env.TOKEN
})

const callApi = (body) => bot.listen({ body }, { end () {} })

exports.redis = redis
exports.bot = bot
exports.callApi = callApi
