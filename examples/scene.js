require('dotenv').load()

const bodyParser = require('body-parser')
const express = require('express')
const Botact = require('../lib')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN,
  sub: process.env.SUB
})

bot.addScene('registration', [
  (ctx) => {
    bot.nextStepScene(ctx)
    return bot.reply(ctx.user_id, 'foo')
  },
  (ctx) => {
    bot.leaveScene(ctx)
    return bot.reply(ctx.user_id, 'bar')
  }
])

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command('регистрация', (ctx) => {
    bot.joinScene(ctx, 'registration')
  })

  bot.listen(req, res)
})

app.listen(80, () => {
  console.log('Server successfully started. Listening on 3000 port.')
})
