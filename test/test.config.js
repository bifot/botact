const { Botact } = require('../')
const createRedis = require('../lib/utils/redis')

const redis = createRedis()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION || 'confirmation',
  group_id: process.env.GROUP_ID || 1,
  token: process.env.TOKEN || 'token',
  framework: 'koa'
})
const sendCallback = (body) => {
  return bot.listen({
    request: {
      body
    },
    body: null,
    status: null
  })
}

module.exports = {
  redis,
  bot,
  sendCallback
}
