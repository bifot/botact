const bodyParser = require('body-parser')
const express = require('express')
const Botact = require('../lib')

require('dotenv').load()

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN,
  sub: process.env.SUB
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command(['start', 'help'], (ctx) => {
    bot.reply(ctx.user_id, 'This is start & help command')
  })

  bot.hears('example', (ctx) => {
    bot.reply(ctx.user_id, 'I heard «example»')
  })

  bot.on(ctx => {
    bot.reply(ctx.user_id, 'This is not command')
  })

  bot.event('group_join', (ctx) => {
    bot.reply(ctx.user_id, 'Thanks for subscribe!')
  })

  bot.listen(req, res).then(body => {
    console.log(JSON.stringify(body, null, 2)) // { "type": "message_new", "object": { "user_id": 145003487, "body": "Hello, world", ... } }
  })
})

app.listen(80, () => {
  console.log('Server successfully started. Listening on 80 port.')
})
