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
  bot.command('start', ({ reply }) => reply('This is start!'))
  bot.command('help', ({ reply }) => reply('Do you need help?'))

  bot.event('group_join', ({ reply }) => reply('Thanks for subscribe!'))
  bot.event('group_leave', ({ reply }) => reply('Oh, you are left...'))

  bot.listen(req, res)
})

app.listen(80)
```

There's some [cool examples](https://github.com/bifot/botact/tree/master/examples).
