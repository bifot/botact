const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN
})

bot.addScene('wizard',
  (ctx) => {
    ctx.scene.next()
    ctx.reply('Write me something!')
  },
  (ctx) => {
    ctx.scene.leave()
    ctx.reply(`You wrote: ${ctx.body}`)
  }
)

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command('join', (ctx) => {
    ctx.scene.join('wizard')
    ctx.reply('Hi, now you are in the scene!')
  })

  bot.listen(req, res)
})

app.listen(80)
