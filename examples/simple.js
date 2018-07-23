const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../')

const { PORT = 3000 } = process.env
const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot.command('start', ({ reply }) => reply('This is start!'))
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
bot.event([ 'group_join', 'wall_repost' ], ({ reply }) => reply('Thanks!'))
bot.on('audio', ({ reply }) => reply('Great music!'))
bot.on('message', ({ reply }) => reply('What?'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(PORT, () => console.log(`ready on ${PORT}`))
