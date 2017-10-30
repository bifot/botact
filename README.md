[![botact](https://img.shields.io/npm/v/botact.svg?style=flat-square)](https://www.npmjs.com/package/botact/)
[![botact](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# Botact

A framework for creating VK bots on callback API.

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

bot
  .command('start', ({ reply }) => reply('This is start!'))
  .command('help', ({ reply }) => reply('Do you need help?'))
  .hears('car', ({ reply }) => reply('I love Tesla!'))
  .hears('skate', ({ reply }) => reply('Good job, skaterino!'))
  .event('group_join', ({ reply }) => reply('Thanks for subscribe!'))
  .event('group_leave', ({ reply }) => reply('Oh, you are left...'))

app.use(bodyParser.json())

app.post('/', bot.listen)

app.listen(process.env.PORT, () => {
  console.log(`Listen on ${process.env.PORT}`)
})
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
* [.uploadAndSaveCoverPhoto(file)](#uploadandsavecoverphotofile)
* [.reply(userId, message, attachment)](replyuserid-message-attachment)
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

### .getOptions()

Get settings.

```js
console.log(bot.getOptions())
// {
//   confirmation: '12345',
//   token: 'abcde...'
// }
```

### .setOptions(settings)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| settings   | object    | yes       |

Set settings.

```js
bot.setOptions({ foo: 'bar' })
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
  console.log(body)
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
bot.command('attach', (ctx) => {
  ctx.reply('Do you need attachment? Take it easy!', 'wall145003487_2068')
})
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

Add command w/ match like RegEx.

```javascript
bot.hears('hello', (ctx) => {
  ctx.sendMessage(ctx.user_id, 'Did you say hello to me?!')
})
```

### .on(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

Add reserved callback.

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

Add [event](https://vk.com/dev/callback_api).

```javascript
bot.event('group_leave', (ctx) => {
  ctx.reply('Oh, you are left...')
})
```

### .uploadDocument(file)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |

Upload document.

```javascript
bot.uploadDocument('./book.pdf')
  .then((file) => {
    console.log(file)
    // {
    //   id: 445225557
    //   owner_id: 145003487,
    //   title: 'book.pdf',
    //   ...
    // }
  })
```

### .uploadPhoto(file)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |

Upload photo.

```javascript
bot.uploadPhoto('./girl.png')
  .then((file) => {
    console.log(file)
    // {
    //   id: 456246067,
    //   album_id: -14,
    //   owner_id: 145003487,
    //   ...
    // }
  })
```

### .uploadAndSaveCoverPhoto(file)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| file       | string    | yes       |

Upload and save cover.

```javascript
bot.uploadAndSaveCoverPhoto('./cover.jpg')
  .then((body) => {
    console.log(body)
    // {
    //   response: {
    //     images: [ [Object], [Object], [Object], [Object], [Object] ]
    //   }
    // }
  })
```

### .reply(userId, message, attachment)

| Parameter  | Type             | Requried  |
| -----------|:----------------:| ---------:|
| userId     | number or array  | yes       |
| message    | string           | yes (no, if setten attachment)   |
| attachment | string           | yes (no, if setten message)      |

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
* [.joinScene(ctx, scene, body, step)](#joinscenectx-scene-body-step)
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

bot
  .addScene('wizard',
    ({ reply, scene: { next } }) => {
      next()
      reply('Write me something!')
     },
    ({ reply, body, scene: { leave } }) => {
      leave()
      reply(`You wrote: ${body}`)
    }
  )
  .command('join', ({ scene: { join } }) => {
    join('wizard')
  })

app.use(bodyParser.json())

app.post('/', bot.listen)

app.listen(process.env.PORT, () => {
  console.log(`Listen on ${process.env.PORT}`)
})
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

### .joinScene(ctx, scene, body, step)

| Parameter  | Type      | Requried |
| -----------|:---------:| --------:|
| ctx        | object    | yes      |
| scene      | string    | yes      |
| body       | object    | no       |
| step       | number    | no       |

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
