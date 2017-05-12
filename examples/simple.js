const bodyParser = require('body-parser')
const express = require('express')
const Botact = require('../lib')

require('dotenv').load()

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN,
  sub: process.env.SUBSCRIBE
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command([ 'start', 'help' ], (ctx) => {
    bot.reply(ctx.uid, 'Hello, world!')
  })

  bot.event('group_join', (ctx) => {
    bot.reply(ctx.uid, 'Thanks for subscribe!')
  })

  bot.confirm(req, res)
  bot.listen(req, res)
})

app.listen(3000, () => console.log('Server successfully started. Listening on 3000 port.'))
