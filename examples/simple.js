const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')

const app = express()

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot.command('start', ({ reply }) => reply('This is start!'))
bot.command('help', ({ reply }) => reply('Do you need help?'))

bot.hears('car', ({ reply }) => reply('I love Tesla!'))
bot.hears('skate', ({ reply }) => reply('Good job, skaterino!'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT, () => console.log(`Listening ${process.env.PORT} port...`))