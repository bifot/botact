const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')
const { confirmation, token } = require('../config')

const app = express()

const bot = new Botact({
  confirmation: process.env.CONFIRMATION || confirmation,
  token: process.env.TOKEN || token
})

bot.command('start', ({ reply }) => reply('This is start!'))
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
bot.event([ 'group_join', 'wall_repost' ], ({ reply }) => reply('Thanks!'))
bot.on(({ reply }) => reply('What?'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT)
