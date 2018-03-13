[![botact](https://img.shields.io/npm/v/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/node/v/botact.svg?style=flat-square)](https://nodejs.org/en/)
[![botact](https://img.shields.io/npm/dm/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/travis/bifot/botact.svg?branch=master&style=flat-square)](https://travis-ci.org/bifot/botact/)
[![botact](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)


# botact.js

Botact enables developers to focus on writing reusable application logic instead of spending time building infrastructure.


## Table of content 
* [Install](#install)
* [Usage](#usage)
* [Botact API](#botact-api)
* [Botact Flow API](#botact-flow-api)
* [TypeScript](#typescript)
* [Tests](#tests)
* [Donate](#donate-)
* [License](#license)


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


## Botact API
### Methods
**Core**
* [constructor(settings)](#constructorsettings)
* [.api(method, settings)](#apimethod-settings)
* [.execute(method, settings, callback)](#executemethod-settings-callback)
* [.reply(user_id, message, attachment)](#replyuser_id-message-attachment)
* [.listen(req, res)](#listenreq-res)

**Actions**
* [.before(callback)](#beforecallback)
* [.command(command, callback)](#commandcommand-callback)
* [.event(event, callback)](#eventevent-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(type, callback)](#ontype-callback)
* [.use(callback)](#usecallback)

**Options**
* [[getter] options](#getter-options)
* [[setter] options](#setter-options)
* [.deleteOptions(settings)](#deleteoptionssettings)

**Upload helpers**
* [.uploadCover(file, settings)](#uploadcoverfile-settings)
* [.uploadDocument(file, type)](#uploaddocumentfile-type)
* [.uploadPhoto(file, peer_id)](#uploadphotofile-peer_id)

### constructor(settings)
Create bot.  

Definition: 
```typescript
constructor (settings: {
  confirmation: string;   // required
  token: string;          // required
  group_id?: number;

  // Flow Settings
  flowTimeout?: number;
  redis?: boolean;
  redisConfig?: any;
})
```
Usage:

```javascript
const { Botact } = require('botact')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})
```

### .api(method, settings)
Call API method (https://vk.com/dev/methods).

Definition:
```typescript
async api (
  method: string,        // required 
  options?: object,      // api call parameters
): Promise<any>;         // Promise with response/error
```
Usage:
```js
const user_data = await bot.api('users.get', {
  user_ids: 1
})
```

### .execute(method, settings, callback)
Call API by [execute](https://vk.com/dev/execute).

Definition:
```typescript
async execute (
  method: string,        // required 
  options?: object,      // api call  parameters
  callback?: function    
): Promise<any>;         // Promise with response/error
 ```

Usage:
```js
bot.execute('users.get', {
  user_ids: 1
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

### .reply(user_id, message, attachment)
Sends message to user

Definition:
```typescript
async reply (
  user_id: number, 
  message: string,      // required, if attachment not setten 
  attachment: string    // required, if message not setten 
): Promise<any>         // Promise with response/error
```

Usage:
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
Start listen [Express](https://github.com/expressjs/express/) server.

Definition:
```typescript
listen (
  req: any,     // Express request, required
  res: any      // Express response, required
)
```

Usage:
```javascript
bot.listen(req, res)
```



## Botact Flow API

### Usage

```sh
$ redis-server
```

### Methods
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


## TypeScript

// TODO


## Tests

```sh
$ npm test
```


## Donate 💰

Thank you for donations.

* **Bitcoin:** 1C26xXoA42Ufz5cNNPhAJY8Ykqh2QB966L
* **Ethereum:** 0x331FeA1a0b0E9E66A647e964cF4eBE1D2E721579
* **Qiwi:** 79522232254


## License

MIT.
