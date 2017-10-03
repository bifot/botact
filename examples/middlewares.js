const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')

const app = express()

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot.use((ctx) => {
  ctx.date = new Date()
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.on(({ reply, date }) => reply(`The date of the message is ${date}`))

  bot.listen(req, res)
})

app.listen(80, () => {
  console.log('Server was started on 80 port...')
})
