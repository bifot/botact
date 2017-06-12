# Botact

Small framework for creating VK bots on Callback.

## Install

```
$ git clone https://github.com/bifot/botact
$ cd botact && npm i
```

## Usage

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const Botact = require('./botact')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.on(ctx => {
    bot.reply(ctx.user_id, `You wrote: ${ctx.body}`)
  })

  bot.event('group_join', ({ user_id }) => {
    bot.reply(user_id, 'Thanks for subscribe!')
  })

  bot.listen(req, res)
})

app.listen(80)
```

There's some [cool examples](https://github.com/bifot/botact/tree/master/examples).
