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
  ({ reply, scene }) => {
    scene.next()
    return reply('Write me something!')
  },
  ({ body, reply, scene }) => {
    scene.leave()
    return reply(`You wrote: "${body}"`)
  }
)

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command('join', ({ reply, scene }) => {
    scene.join('wizard')
    reply('Hi, now you are in the scene!')
  })

  bot.listen(req, res)
})

app.listen(80)
