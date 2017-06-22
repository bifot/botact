const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const i18n = require('i18n')
const { Botact } = require('../index')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN
})

i18n.configure({
  locales: [ 'ru', 'en' ],
  directory: path.resovle(__dirname, './locales')
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command('start', (ctx) => {
    bot.reply(ctx.user_id, i18n.__('greeting', { id: ctx.user_id }))
  })

  bot.command('en', (ctx) => {
    i18n.setLocale('en')
    bot.reply(ctx.user_id, i18n.__('switch', { lang: 'English' }))
  })

  bot.command('ru', (ctx) => {
    i18n.setLocale('ru')
    bot.reply(ctx.user_id, i18n.__('switch', { lang: 'Русский' }))
  })

  bot.listen(req, res)
})

app.listen(80)
