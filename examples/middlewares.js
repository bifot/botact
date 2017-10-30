const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('../index')

const app = express()

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot
  .use((ctx) => {
    ctx.date = new Date()
  })
  .on(({ reply, date }) => {
    reply(`The date of the message is ${date}`)
  })

app.use(bodyParser.json())

app.post('/', bot.listen)

app.listen(process.env.PORT, () => {
  console.log(`Listen on ${process.env.PORT}`)
})
