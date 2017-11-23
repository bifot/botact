[![botact](https://img.shields.io/npm/v/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# Botact

A framework for creating VK bots on callback API.

## Donate 💰

*With this framework you can save up to 12 hours per bot*.

Thank you for donations.

* **Bitcoin:** 1C26xXoA42Ufz5cNNPhAJY8Ykqh2QB966L
* **Ethereum:** 0x331FeA1a0b0E9E66A647e964cF4eBE1D2E721579
* **Qiwi:** 79522232254

## Install

```sh
$ npm i botact
```

## Tests

```sh
$ npm test
```

## Usage

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot.command('start', ({ reply }) => reply('This is start!'))
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
bot.event('group_join', ({ reply }) => reply('Thanks!'))
bot.on(({ reply }) => reply('What?'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT)
```

## Methods

* [constructor(options)](#constructoroptions)
* [[getter] options](#getter-options)
* [[setter] options](#setter-options)
* [.deleteOptions(settings)](#deleteoptionssettings)
* [.execute(method, settings, token, callback)](#executemethod-settings-token-callback)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(callback)](#oncallback)
* [.event(event, callback)](#eventevent-callback)
* [.uploadDocument(file)](#uploaddocumentfile)
* [.uploadPhoto(file)](#uploadphotofile)
* [.uploadAndSaveCoverPhoto(file)](#uploadandsavecoverphotofile)
* [.reply(userId, message, attachment, callback)](#replyuserid-message-attachment-callback)
* [.listen(req, res)](#listenreq-res)

### constructor(options)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| options    | object    | yes       |

Create bot.

```javascript
const { Botact } = require('botact')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})
```

### [getter] options

Get options.

```js
bot.options
// {
//   confirmation: '12345',
//   token: 'abcde...'
// }
```

### [setter] options

Set options.

```js
bot.options = { foo: 'bar' }
// {
//   confirmation: '12345',
//   token: 'abcde...',
//   foo: 'bar'
// }
```

### .deleteOptions(settings)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| settings   | array     | yes       |

Delete keys settings.

```js
bot.deleteOptions([ 'token', 'confirmation' ])
// {
//   foo: 'bar'
// }
```

### .execute(method, settings, token, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| method     | string    | yes       |
| settings   | object    | yes       |
| token      | string    | yes       |
| callback   | function  | no       |

Call API by [execute](https://vk.com/dev/execute).

```js
bot.execute('users.get', {
  user_ids: 1
}, this.settings.token, (body) => {
  // {
  //   id: 1,
  //   first_name: 'Pavel',
  //   last_name: 'Durov'
  // }
})
```

### .command(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

Add command w/ strict match.

```javascript
bot.command('start', ({ reply }) => {
  reply('This is start!')
})
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string/regexp | yes       |
| callback   | function  | yes       |

Add command w/ match like RegEx.

```javascript
bot.hears(/(car|tesla)/, ({ reply }) => {
  reply('I love Tesla!')
})

```

### .on(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

Add reserved callback.

```javascript
bot.on(({ reply }) => {
  reply('What?')
})
```

### .event(event, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| event      | string    | yes       |
| callback   | function  | no        |

Add [event](https://vk.com/dev/callback_api).

```javascript
bot.event('group_join', ({ reply }) => {
  reply('Thanks!')
})
```

### .uploadDocument(file)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |

Upload document.

```javascript
await bot.uploadDocument(path.join(__dirname, 'files', 'book.pdf'))
// {
//   id: 445225557
//   owner_id: 145003487,
//   title: 'book.pdf',
//   ...
// }
```

### .uploadPhoto(file)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |

Upload photo.

```javascript
await bot.uploadPhoto(path.join(__dirname, 'files', 'girl.png')) // { id: 456246067, ... }
// {
//   id: 456246067,
//   album_id: -14,
//   owner_id: 145003487,
//   ...
// }
```

### .uploadAndSaveCoverPhoto(file)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |

Upload and save cover.

```javascript
await bot.uploadAndSaveCoverPhoto('./cover.jpg')
// {
//   response: {
//     images: [ [Object], [Object], [Object], [Object], [Object] ]
//   }
// }
```

### .reply(userId, message, attachment, callback)

| Parameter  | Type             | Requried  |
| -----------|:----------------:| ---------:|
| userId     | number or array  | yes       |
| message    | string           | yes (no, if setten attachment)   |
| attachment | string           | yes (no, if setten message)      |
| callback   | function         | no        |

```javascript
bot.command('start', (ctx) => {
  // with shortcut from context
  ctx.reply('Hi, this is start!')
  // function from context
  ctx.sendMessage(ctx.user_id, 'Hi, this is start!')
  // simple usage
  bot.reply(ctx.user_id, 'Hi, this is start!')
  // to multiple users
  bot.reply([ ctx.user_id, 1 ], 'Hi, this is start!')
})
```

### .listen(req, res)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| req        | object    | yes       |
| res        | object    | yes       |

Start listen.

```javascript
bot.listen(req, res)
```

## Scenes

### Usage

```sh
$ redis-server
```

* [.addScene(name, ...callbacks)](#addscenename-callbacks)
* [.joinScene(ctx, scene, body, step, now)](#joinscenectx-scene-body-step-now)
* [.leaveScene(ctx)](#leavescenectx)
* [.nextScene(ctx, body)](#nextscenectx-body)

### Example

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN,
  flowTimeout: 20, // document will be deleted after 20 secs
  redisConfig: {
    host: '127.0.0.1', // default host for redis
    port: 8080 // custom port for redis
  },
})

bot.addScene('wizard',
  ({ reply, scene: { next } }) => {
    next()
    reply('Write me something!')
   },
  ({ reply, body, scene: { leave } }) => {
    leave()
    reply(`You wrote: ${body}`)
  }
)

bot.command('join', ({ scene: { join } }) => join('wizard'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT)
```

### .addScene(name, ...callbacks)

| Parameter  | Type      | Requried    |
| -----------|:---------:| -----------:|
| name       | string    | yes         |
| callbacks  | function  | minumum one |

Add scene.

```javascript
bot.addScene('wizard',
  ({ reply, scene: { next } }) => {
    next()
    reply('Write me something!')
  },
  ({ reply, body, scene: { leave } }) => {
    leave()
    reply(`You wrote: ${body}`)
  }
)
```

### .joinScene(ctx, scene, body, step, now)

| Parameter  | Type      | Requried | Default |
| -----------|:---------:| :-------:| -------:|
| ctx        | object    | yes      | none    |
| scene      | string    | yes      | none    |
| body       | object    | no       | {}      |
| step       | number    | no       | 0       |
| now        | number    | no       | true    |

Enter scene.

```javascript
bot.command('join', (ctx) => {
  // with shortcut without additional settings
  ctx.scene.join('wizard')
  // simple usage with additional settings
  bot.joinScene(ctx, 'wizard', { foo: 'bar' })
})
```

### .leaveScene(ctx)

| Parameter  | Type      | Requried |
| -----------|:---------:| --------:|
| ctx        | object    | yes      |

Leave scene.

```javascript
bot.addScene('wizard',
  (ctx) => {
    // with shortcut
    ctx.scene.leave()
    // simple usage
    bot.leaveScene(ctx)
  }
)
```

### .nextScene(ctx, body)

| Parameter  | Type      | Requried |
| -----------|:---------:| --------:|
| ctx        | object    | yes      |
| body       | obect     | no       |

Navigate to the next stage scene.

```javascript
bot.addScene('wizard',
  (ctx) => {
    // with shortcut without additional settings
    ctx.scene.next({ foo: 'bar' })
    // simple usage with additional settings
    bot.nextScene(ctx, { foo: 'bar' })
  }
)
```

## License

MIT.
