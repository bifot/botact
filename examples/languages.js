const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const i18n = require('i18n')
const { Botact } = require('../index')
const { confirmation, token } = require('../config')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION || confirmation,
  token: process.env.TOKEN || token
})

i18n.configure({
  locales: ['ru', 'en'],
  directory: path.join(__dirname, 'locales')
})

bot.command('start', ({ reply, user_id }) => reply(i18n.__('greeting', { id: user_id })))
bot.command('en', ({ reply }) => {
  i18n.setLocale('en')
  reply(i18n.__('switch', { lang: 'English' }))
})
bot.command('ru', ({ reply }) => {
  i18n.setLocale('ru')
  reply(i18n.__('switch', { lang: 'Русский' }))
})

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT)
