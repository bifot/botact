const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')
const { confirmation, token } = require('../config')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION || confirmation,
  token: process.env.TOKEN || token,
  redis: true
})

bot.addScene('wizard',
  ({ reply, scene: { next } }) => {
    next({ date: new Date() })
    reply('Write me something!')
  },
  ({ reply, body, session: { date }, scene: { leave } }) => {
    leave()
    reply(`You wrote: ${body} at ${date.toString()}`)
  }
)

bot.command([ 'join', 'scene' ], ({ scene: { join } }) => join('wizard'))
bot.hears([ 'first', 'two' ], ({ reply }) => reply('Numbers...'))
bot.on(({ reply }) => reply('What did you said?'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT)
