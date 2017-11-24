const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')
const { confirmation, token } = require('../config')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION || confirmation,
  token: process.env.TOKEN || token
})

bot.use(ctx => ctx.date = new Date())
bot.on(({ reply, date }) => reply(`The date of the message is ${date}`))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT)
