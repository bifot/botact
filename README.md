[![botact](https://img.shields.io/npm/v/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/node/v/botact.svg?style=flat-square)](https://nodejs.org/en/)
[![botact](https://img.shields.io/npm/dm/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/travis/bifot/botact.svg?branch=master&style=flat-square)](https://travis-ci.org/bifot/botact/)
[![botact](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# botact.js

Botact enables developers to focus on writing reusable application logic instead of spending time building infrastructure.

## Donate 💰

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

* [constructor(settings)](#constructoroptions)
* [[getter] options](#getter-options)
* [[setter] options](#setter-options)
* [.deleteOptions(settings)](#deleteoptionssettings)
* [.before(callback)](#beforecallback)
* [.use(callback)](#usecallback)
* [.execute(method, settings, callback)](#executemethod-settings-callback)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(type, callback)](#ontype-callback)
* [.event(event, callback)](#eventevent-callback)
* [.uploadDocument(file, type)](#uploaddocumentfile-type)
* [.uploadPhoto(file, peer_id)](#uploadphotofile-peer_id)
* [.uploadCover(file, settings)](#uploadcoverfile-settings)
* [.reply(user_id, message, attachment, callback)](#replyuser_id-message-attachment-callback)
* [.listen(req, res)](#listenreq-res)

### constructor(settings)

| Parameter  | Type      | Requried  | Default |
| -----------|:---------:| :--------:| ---------:|
| settings    | object    | yes      | |
| settings.token | string | yes | |
| settings.confirmation | string | yes | |
| settings.group_id | number | no | |
| settings.redis | boolean | no  | false |

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

### .before(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

Add callback before bot will start.

```js
bot.before(() => new Date())

bot.on(({ inital }) => {
  // Fri Nov 24 2017 16:00:21 GMT+0300 (MSK)
})
```

### .use(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

Add middleware.

```js
bot.use(ctx => ctx.date = new Date())

bot.on(({ date }) => {
  // Fri Nov 24 2017 16:00:21 GMT+0300 (MSK)
})
```

### .execute(method, settings, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| method     | string    | yes       |
| settings   | object    | yes       |
| callback   | function  | no        |

Call API by [execute](https://vk.com/dev/execute).

```js
bot.execute('users.get', {
  user_ids: 1,
  access_token: this.settings.token
}, (body) => {
  // {
  //   response: [{
  //     id: 1,
  //     first_name: 'Павел',
  //     last_name: 'Дуров'
  //   }]
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
bot.command('start', ({ reply }) => reply('This is start!'))
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string/regexp | yes   |
| callback   | function  | yes       |

Add command w/ match like RegEx.

```javascript
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
```

### .on(type, callback)

| Parameter  | Type      | Requried  | Default |
| -----------|:---------:| :--------:| -------:|
| type       | string    | no        | message |
| callback   | function  | yes       |         |

Add reserved callback.

```javascript
bot.on(({ reply }) => reply('What?'))
bot.on('audio', ({ reply }) => reply('Great music!'))
```

### .event(event, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| event      | string    | yes       |
| callback   | function  | no        |

Add [event](https://vk.com/dev/callback_api).

```javascript
bot.event('group_join', ({ reply }) => reply('Thanks!'))
```

### .uploadDocument(file, type)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |
| type       | string    | no        |

Upload document.

```javascript
await bot.uploadDocument('./book.pdf')
// {
//   id: 445225557
//   owner_id: 145003487,
//   title: 'book.pdf',
//   ...
// }
```

### .uploadPhoto(file, peer_id)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |
| peer_id    | number    | yes       |

Upload photo.

```javascript
await bot.uploadPhoto('./girl.png', 1) // { id: 456246067, ... }
// {
//   id: 456246067,
//   album_id: -14,
//   owner_id: 145003487,
//   ...
// }
```

### .uploadCover(file, settings)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |
| settings   | object    | no        |

Upload and save cover.

```javascript
await bot.uploadCover('./cover.jpg', { crop_x2: 1590 })
// {
//   images: [
//     [Object],
//     [Object],
//     [Object],
//     [Object],
//     [Object]
//   ]
// }
```

### .reply(user_id, message, attachment, callback)

| Parameter  | Type             | Requried  |
| -----------|:----------------:| ---------:|
| user_id     | number or array  | yes       |
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
* [.joinScene(ctx, scene, session, step, now)](#joinscenectx-scene-session-step-now)
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

### .joinScene(ctx, scene, session, step, now)

| Parameter  | Type      | Requried | Default |
| -----------|:---------:| :-------:| -------:|
| ctx        | object    | yes      | none    |
| scene      | string    | yes      | none    |
| session    | object    | no       | {}      |
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
| session    | obect     | no       |

Navigate scene.

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
