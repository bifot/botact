[![botact](https://img.shields.io/npm/v/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/) [![botact](https://img.shields.io/node/v/botact.svg?style=flat-square)](https://nodejs.org/en/) [![botact](https://img.shields.io/npm/dm/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/) [![botact](https://img.shields.io/travis/bifot/botact.svg?branch=master&style=flat-square)](https://travis-ci.org/bifot/botact/) [![botact](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# botact.js

Botact enables developers to focus on writing reusable application logic instead of spending time building infrastructure.

## Table of content

- [Install](#install)
- [Usage](#usage)
- [Botact API](#botact-api)
- [Botact Flow API](#botact-flow-api)
- [TypeScript](#typescript)
- [Tests](#tests)
- [License](#license)

## Install

**via npm:**

```sh
$ npm i botact -S
```

**via yarn:**

```sh
$ yarn add botact
```

## Examples

**express:**

```javascript
const express = require('express')
const bodyParser = require('body-parser')
const { Botact } = require('botact')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

// User wrote command 'start'
bot.command('start', ({ reply }) => {
  reply('This is start!')
})

// User wrote message which contains 'car' or 'tesla'
bot.hears(/(car|tesla)/, ({ reply }) => {
  reply('I love Tesla!')
})

// User joined in the group
bot.event('group_join', ({ reply }) => {
  reply('Thanks!')
})

// User wrote any message
bot.on(({ reply }) => {
  reply('What?')
})

// Parser request body
app.use(bodyParser.json())

// Bot's endpoint
app.post('/', bot.listen)

// Start listen on 3000
app.listen(process.env.PORT)
```

**koa:**

```js
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { Botact } = require('botact')

const app = new Koa()
const router = new Router()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN,
  framework: 'koa'
})

// User wrote command 'start'
bot.command('start', ({ reply }) => {
  reply('This is start!')
})

// User wrote message which contains 'car' or 'tesla'
bot.hears(/(car|tesla)/, ({ reply }) => {
  reply('I love Tesla!')
})

// User joined in the group
bot.event('group_join', ({ reply }) => {
  reply('Thanks!')
})

// User wrote any message
bot.on(({ reply }) => {
  reply('What?')
})

// Bot's endpoint
router.post('/', bot.listen)

// Parser request body
app.use(bodyParser())
// Connect routes
app.use(router.routes())

// Start listen on 3000
app.listen(3000)
```

## Botact API

## Methods

### Core

- [constructor(settings)](#constructorsettings)
- [.api(method, settings)](#apimethod-settings)
- [.execute(method, settings, callback)](#executemethod-settings-callback)
- [.reply(userId, message, attachment, keyboard)](#replyuserid-message-attachment-keyboard)
- [.listen(...args)](#listenargs)

### Actions

- [.command(command, callback)](#commandcommand-callback)
- [.event(event, callback)](#eventevent-callback)
- [.hears(command, callback)](#hearscommand-callback)
- [.on(type, callback)](#ontype-callback)
- [.use(callback)](#usecallback)

### Options

- [[getter] options](#getter-options)
- [[setter] options](#setter-options)
- [.deleteOptions(settings)](#deleteoptionssettings)

### Upload helpers

- [.uploadCover(file, settings)](#uploadcoverfile-settings)
- [.uploadDocument(file, peerId, type)](#uploaddocumentfile-peerid-type)
- [.uploadPhoto(file, peerId)](#uploadphotofile-peerid)

### Error Handling

- [.catch(handler)](#catchhandler)
- [.throw(error)](#throwerror)
- [.assert(value, message)](#assertvalue-message)

--------------------------------------------------------------------------------

## Botact API: Core [↑](#botact-api)

### constructor(settings)

Create bot.

**Definition:**

```typescript
constructor (settings: {
  confirmation: string;   // required
  token: string;          // required
  group_id?: number;
  framework?: string;     // Server framework (express/koa)

  // Flow Settings
  flowTimeout?: number;   // Document expire time, in seconds
  redis?: boolean;        // false by default
  redisConfig?: object;   // {} by default
})
```

**Usage:**

```javascript
const { Botact } = require('botact')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})
```

### .api(method, settings)

Call API method (<https://vk.com/dev/methods>).

**Definition:**

```typescript
async api (
  method: string,        // required
  options?: object,      // api call parameters
): Promise<any>;         // Promise with response/error
```

**Usage:**

```javascript
const data = await bot.api('users.get', {
  user_ids: 1
})
```

### .execute(method, settings, callback)

Call API by [execute](https://vk.com/dev/execute).

**Definition:**

```typescript
async execute (
  method: string,        // required
  options?: object,      // api call  parameters
  callback?: function    
): Promise<any>;         // Promise with response/error
```

**Usage:**

```javascript
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

### .reply(userId, message, attachment, keyboard)

Sends message to user

**Definition:**

```typescript
async reply (
  userId: number,
  message: string,      // required, if attachment not setten
  attachment: string,   // required, if message not setten
  keyboard: Object      // optional
): Promise<any>         // Promise with response/error
```

**Usage:**

```javascript
bot.command('start', (ctx) => {
  // via shortcut from context
  ctx.reply('Hi, this is start!')
  // via shortcut with keyboard
  ctx.reply('Yo, this is keyboard?', null, {
    one_time: false,
    buttons: [
      [
        {
          action: {
            type: 'text',
            payload: {
              button: 'Hello, world!'
            },
            label: 'Hello, world!'
          },
          color: 'primary'
        }
      ]
    ]
  })
  // via function from context
  ctx.sendMessage(ctx.user_id, 'Hi, this is start!')
  // via function from instance
  bot.reply(ctx.user_id, 'Hi, this is start!')
  // to multiple users
  bot.reply([ ctx.user_id, 1 ], 'Hi, this is start!')
})
```

### .listen(...args)

Start listen.

**Definition:**

express:

```typescript
listen (
  req: any,           // Express request, required
  res: any            // Express response, required
  callback: function  // Callback for errors
)
```

koa:

```typescript
listen (
  ctx: object,        // Koa object, required
  callback: function  // Callback for errors
)
```

**Usage:**

```javascript
// express
bot.listen(req, res, (error) => {
  res.status(500).json({
    error: 'Server error'
  })
})

// koa
bot.listen(ctx, (error) => {
  ctx.throw(500, 'Server error')
})
```

## Botact API: Actions [↑](#botact-api)

### .command(command, callback)

Add command w/ strict match.

**Definition:**

```typescript
command (
  command: string | string[],
  callback: function
): Botact
```

**Usage:**

```javascript
bot.command('start', ({ reply }) => reply('This is start!'))
```

### .event(event, callback)

Add [event](https://vk.com/dev/groups_events) handler .

**Definition:**

```typescript
event (
  event: string | string[],
  callback: function
): Botact;
```

**Usage:**

```javascript
bot.event('group_join', ({ reply }) => reply('Thanks!'))
```

### .hears(command, callback)

Add command w/ match like RegEx.

**Definition:**

```typescript
hears (
  hear: string | RegExp | (string | RegExp)[],
  callback: function
): Botact;
```

**Usage:**

```javascript
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
```

### .on(type, callback)

Add reserved callback.

**Definition:**

```typescript
on (
  type: string,
  callback: function
): Botact;

OR

on (
  callback: function
): Botact;
```

**Usage:**

```javascript
bot.on(({ reply }) => reply('What?'))
bot.on('audio', ({ reply }) => reply('Great music!'))
```

### .use(callback)

Add middleware.

**Definition:**

```typescript
use (
  callback: function
): Botact
```

**Usage:**

```javascript
bot.use(ctx => ctx.date = new Date())

bot.on(({ date }) => {
  // Fri Nov 24 2017 16:00:21 GMT+0300 (MSK)
})
```

## Botact API: Options [↑](#botact-api)

### [getter] options

Get options.

```javascript
bot.options
// {
//   confirmation: '12345',
//   token: 'abcde...'
// }
```

### [setter] options

Set options.

```javascript
bot.options = { foo: 'bar' }
// {
//   confirmation: '12345',
//   token: 'abcde...',
//   foo: 'bar'
// }
```

### .deleteOptions(settings)

Delete keys settings.

**Definition:**

```typescript
deleteOptions (
  keys: string[]
): Botact
```

**Usage:**

```javascript
bot.deleteOptions([ 'token', 'confirmation' ])
// {
//   foo: 'bar'
// }
```

## Botact API: Upload helpers [↑](#botact-api)

### .uploadCover(file, settings)

Upload and save cover. See detailed settings [here](https://vk.com/dev/photos.getOwnerCoverPhotoUploadServer).

**Definition:**

```typescript
async uploadCover (
  filepath: string,    // Path to file with cover
  settings?: object
): Promise<any>        // Promise with response/error
```

**Usage:**

```javascript
await bot.uploadCover('./cover.jpg', { crop_x2: 1590 })
// {
//   images: [
//     {
//       url: "URL",
//       width: 1920,
//       height: 1080
//     },
//     [Object],
//     [Object],
//     [Object],
//     [Object]
//   ]
// }
```

### .uploadDocument(file, peer_id, type)

Uploads document to peer.

**Definition:**

```typescript
async uploadDocument (
  filepath: string,               // Path to file
  peer_id: number,
  type: 'doc' | 'audio_message'   // 'doc' by default
): Promise<any>;                  // Promise with response/error
```

**Usage:**

```javascript
await bot.uploadDocument('./book.pdf', 1234)
// {
//   response:
//     [{
//       id: 1234,
//       owner_id: 1234,
//       title: "",
//       ...
//     }]
// }
```

### .uploadPhoto(file, peer_id)

Uploads photo to peer.

**Definition:**

```typescript
async uploadPhoto (
  filepath: string,   // Path to picture
  peer_id: number
): Promise<any>       // Promise with response/error
```

**Usage:**

```javascript
await bot.uploadPhoto('./picture.png', 1234)
// {
//   id: 1234,
//   album_id: 1234,
//   owner_id: 1234,
//   ...
// }
```

## Botact API: Error Handling [↑](#botact-api)

### .catch(handler)

Add catch handler for errors.

**Default handler:**

```js
console.error(`❌ Botact Error: ${typeof err === 'object' ? JSON.stringify(err) : err}`)
```

**Usage:**

```js
// Handle all botact errors here
bot.catch((ctx, err) => {
  // ctx - user's context
  // err - throwed error
  console.error(ctx, err)
})

bot.on((ctx) => {
  if (ctx.peer_id !== 1) {
    // Throw error to the .catch handler
    return ctx.throw('User is not Pavel Durov')
  }
})
```

### .throw(error)

Throw error.

**Usage:**

```js
bot.catch((ctx, err) => {
  console.error(ctx, err)
})

bot.command('start', (ctx) => {
  if (ctx.peer_id === 301361473) {
    return ctx.throw('User is blocked')
  }
  
  ctx.reply('Hello, how are you?')
})
```

### .assert(value, message)

Helper method to throw an error similar to .throw() when !value.

```js
bot.catch((ctx, err) => {
  console.error(ctx, err)
})

bot.command('start', (ctx) => {
  ctx.assert(ctx.peer_id !== 301361473, 'User is blocked')
  ctx.reply('Hello, how are you?')
})
```

--------------------------------------------------------------------------------

## Botact Flow API

### Usage

```javascript
const bot = new Botact({
  ...,
  redis: true       // enable redis
  flowTimeout: 20   // timeout for delete documents
  redisConfig: {    // redis config
    port: 1234
  }
})
```

```sh
$ redis-server
```

### Methods

- [.addScene(name, ...callbacks)](#addscenename-callbacks)
- [.joinScene(ctx, scene, session, step, now)](#joinscenectx-scene-session-step-now)
- [.nextScene(ctx, body)](#nextscenectx-body)
- [.leaveScene(ctx)](#leavescenectx)

### Example

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

const app = express()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN,
  redis: true,
  flowTimeout: 20,      // document will be deleted after 20 secs
  redisConfig: {
    host: '127.0.0.1',  // default host for redis
    port: 8080          // custom port for redis
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

## Botact Flow API: Methods

### .addScene(name, ...callbacks)

Add scene.

**Definition:**

```typescript
addScene (
  name: string,
  ...args: function[]
): Botact;
```

**Usage:**

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

Enter scene.

**Definition:**

```typescript
async joinScene (
  ctx: object,
  scene: string,
  session?: object,      // {} by default
  step?: number,         // 0 by default
  instantly?: boolean    // true by default
): Promise<Botact>;
```

**Usage:**

```javascript
bot.command('join', (ctx) => {
  // with shortcut without additional settings
  ctx.scene.join('wizard')
  // simple usage with additional settings
  bot.joinScene(ctx, 'wizard', { foo: 'bar' })
})
```

### .nextScene(ctx, body)

Navigate scene.

**Definition:**

```typescript
async nextScene (
  ctx: object,
  session?: object,      // {} by default
): Promise<Botact>;
```

**Usage:**

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

### .leaveScene(ctx)

Leave scene.

**Definition:**

```typescript
async leaveScene(
  ctx: object
): Promise<Botact>;
```

**Usage:**

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

--------------------------------------------------------------------------------

## TypeScript

Botact includes [TypeScript](https://www.typescriptlang.org/) definitions.

## Tests

**via npm:**

```sh
$ npm test
```

**via yarn:**

```sh
$ yarn test
```

## License

MIT.
