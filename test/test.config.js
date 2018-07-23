const { Botact } = require('../')
const createRedis = require('../lib/utils/redis')

const redis = createRedis()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.GROUP_ID,
  token: process.env.TOKEN,
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
