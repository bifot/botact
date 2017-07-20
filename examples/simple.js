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

  bot.listen(req, res)
})

app.listen(80)
