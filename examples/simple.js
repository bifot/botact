const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')

const app = express()

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot
  .command('start', ({ reply }) => reply('This is start!'))
  .command('help', ({ reply }) => reply('Do you need help?'))
  .hears('car', ({ reply }) => reply('I love Tesla!'))
  .hears('skate', ({ reply }) => reply('Good job, skaterino!'))
  .event('group_join', ({ reply }) => reply('Thanks for subscribe!'))
  .event('group_leave', ({ reply }) => reply('Oh, you are left...'))

app.use(bodyParser.json())

app.post('/', bot.listen)

app.listen(process.env.PORT, () => {
  console.log(`Listen on ${process.env.PORT}`)
})
