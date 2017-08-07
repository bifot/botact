require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')

const app = express()

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN,
  secret: process.env.SECRET
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command('start', (ctx) => ctx.reply('This is start!'))
  bot.command('help', (ctx) => ctx.reply('Do you need help?'))

  bot.hears('car', (ctx) => ctx.reply('I love Tesla!'))
  bot.hears('skate', (ctx) => ctx.reply('Good job, skaterino!'))

  bot.listen(req, res).catch(console.log)
})

app.listen(80, () => {
  console.log('Server was started on 80 port...')
})
