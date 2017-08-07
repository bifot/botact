[![botact](https://img.shields.io/npm/v/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# Botact

Framework for creating VK bots on Callback. Read about the framework in the [official docs of VK](https://vk.com/dev/bots_docs).

## Install

```sh
$ npm i botact
```

## Usage

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  bot.command('start', (ctx) => ctx.reply('This is start!'))
  bot.command('help', (ctx) => ctx.reply('Do you need help?'))

  bot.event('group_join', (ctx) => ctx.reply('Thanks for subscribe!'))
  bot.event('group_leave', (ctx) => ctx.reply('Oh, you are left...'))

  bot.listen(req, res)
})

app.listen(80)
```

## Methods

* [constructor(options)](#constructoroptions)
* [.getOptions()](#getoptions)
* [.setOptions(settings)](#setoptionssettings)
* [.deleteOptions(settings)](#deleteoptionssettings)
* [.execute(method, settings, token, callback)](#executemethod-settings-token-callback)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(callback)](#oncallback)
* [.event(event, callback)](#eventevent-callback)
* [.uploadDocument(file)](#uploaddocumentfile)
* [.uploadPhoto(file)](#uploadphotofile)
* [.reply(userId, message, attachment)](replyuserid-message-attachment)
* [.listen(req, res)](#listenreq-res)

### constructor(options)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| options    | object    | yes       |

You need to set the group_id, token and confirmation code.

```javascript
const { Botact } = require('botact')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN
})
```

### .getOptions()

Returns the parameters of the bot.

### .setOptions(settings)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| settings   | object    | yes       |

Sets the parameters for the bot's settings.

### .deleteOptions(settings)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| settings   | array     | yes       |

Deletes the parameters from the bot's settings.

### .execute(method, settings, token, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| method     | string    | yes       |
| settings   | object    | yes       |
| token      | string    | yes       |
| callback   | function  | no       |

Executing a request to API by [execute](https://vk.com/dev/execute).

### .command(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

If the bot get a message which equal to command, then will run a callback.

```javascript
bot.command('attach', (ctx) => {
  ctx.reply('Do you need attachment? Take it easy!', 'wall145003487_2068')
})
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

If the bot hears a command in message from user, then will run callback (e.g. user sent 'Hello, world' and bot hears 'hello', then bot will run a callback).

```javascript
bot.hears('hello', (ctx) => {
  ctx.sendMessage(ctx.user_id, 'Did you say hello to me?!')
})
```

### .on(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

If the bot receives a message and doesn't find an answer to it, it will run a callback.

```javascript
bot.on((ctx) => {
  ctx.reply('I don\'t understand you!')
})
```

### .event(event, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| event      | string    | yes       |
| callback   | function  | no        |

Adding a callback to [events](https://vk.com/dev/callback_api).

```javascript
bot.event('group_leave', (ctx) => {
  ctx.reply('Oh, you are left...')
})
```

### .uploadDocument(path)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| path       | string    | yes       |

Uploading document.

```javascript
bot.uploadDocument('./book.pdf')
  .then((file) => {
    console.log(file) // => { id: 445225557, owner_id: 145003487, title: 'book.pdf', ... }
  })
```

### .uploadPhoto(path)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| path       | string    | yes       |

Uploading photo.

```javascript
bot.uploadPhoto('./girl.png')
  .then((file) => {
    console.log(file) // => { id: 456246067, album_id: -14, owner_id: 145003487, ... }
  })
```

### .reply(userId, message, attachment)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| userId     | number    | yes       |
| message    | string    | yes (no, if setten attachment)   |
| attachment | string    | yes (no, if setten message)      |

```javascript
bot.command('start', (ctx) => {
  // with shortcut
  ctx.reply('Hi, this is start!')
  // simple usage
  bot.reply(ctx.user_id, 'Hi, this is start!')
  // function from context
  ctx.sendMessage(ctx.user_id, 'Hi, this is start!')
})
```

### .listen(req, res)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| req        | object    | yes       |
| res        | object    | yes       |

Start listening.

```javascript
bot.listen(req, res)
```

## Scenes

If your bot contains complex logic, you can use scenes for this.

* [.addScene(name, ...callbacks)](#addscenename-callbacks)
* [.joinScene(ctx, session, step)](#joinscenectx-session-step)
* [.leaveScene(ctx)](#leavescenectx)
* [.nextScene(ctx)](#nextscenectx)

### Example

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

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
    ctx.reply(`You wrote: "${body}"`)
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
```

### .addScene(name, ...callbacks)

| Parameter  | Type      | Requried    |
| -----------|:---------:| -----------:|
| name       | string    | yes         |
| callbacks  | function  | minumum one |

Registering scene and adding callbacks to her.

```javascript
bot.addScene('wizard',
  (ctx) => {
    ctx.scene.next()
    ctx.reply('Write me something!')
  },
  (ctx) => {
    ctx.scene.leave()
    ctx.reply(`You wrote: "${body}"`)
  }
)
```

### .joinScene(ctx, session, step)

| Parameter  | Type      | Requried |
| -----------|:---------:| --------:|
| ctx        | object    | yes      |
| session    | string    | yes      |
| step       | number    | no       |

Joining in a scene.

```javascript
bot.command('join', (ctx) => {
  // with shortcut
  ctx.scene.join('wizard')
  // simple usage
  bot.joinScene(ctx, 'wizard')
})
```

### .leaveScene(ctx)

| Parameter  | Type      | Requried |
| -----------|:---------:| --------:|
| ctx        | object    | yes      |

Leave from scene.

```javascript
bot.addScene('wizard',
  (ctx) => {
    // With shortcut
    ctx.scene.leave()
    // Simple Usage
    bot.leaveScene(ctx)
  }
)
```

### .nextScene(ctx)

| Parameter  | Type      | Requried |
| -----------|:---------:| --------:|
| ctx        | object    | yes      |

Go to the next stage of scene.

```javascript
bot.addScene('wizard',
  (ctx) => {
    // With shortcut
    ctx.scene.next()
    // Simple Usage
    bot.nextScene(ctx)
  }
)
```

## License

MIT.
