const bodyParser = require('body-parser')
const express = require('express')
const Botact = require('../lib')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN,
  log: true
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command(['start', 'help'], ({ user_id }) => {
    bot.reply(user_id, 'This is start & help command')
  })

  bot.hears('example', ({ user_id }) => {
    bot.reply(user_id, 'I heard «example»')
  })

  bot.on(({ user_id }) => {
    bot.reply(user_id, 'This is not command')
  })

  bot.event('group_join', ({ user_id }) => {
    bot.reply(user_id, 'Thanks for subscribe!')
  })

  bot.listen(req, res).then(body => {
    console.log(JSON.stringify(body, null, 2)) // { "type": "message_new", "object": { "user_id": 145003487, "body": "Hello, world", ... } }
  })
})

app.listen(80)
