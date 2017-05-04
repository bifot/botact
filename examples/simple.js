const bodyParser = require('body-parser')
const express = require('express')
const Botact = require('../lib')

const app = express()
const bot = new Botact({
  confirmation: '2b279e1a',
  group_id: 138165805,
  token: 'd905ad2f35a561e1f87ecce5847c105aa63bfbfd7f80c60b1fc769d9c2f8b2b96a6c048a1810350b9a191',
  sub: 'Bot works only for followers.'
})

bot.execute()
app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command([ 'start', 'help' ], (data) => {
    bot.reply(data.user_id, 'Hello, world!')
  })

  bot.event('group_join', (data) => {
    bot.reply(data.user_id, 'Thanks for subscribe!')
  })

  bot.confirm(req, res)
  bot.listen(req, res)
})

app.listen(3000, () => console.log('Server successfully started. Listening on 3000 port.'))
