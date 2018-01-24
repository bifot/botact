const { expect } = require('chai')
const path = require('path')
const { RedisClient, createClient, Multi } = require('redis')
const { promisifyAll } = require('bluebird')
const { Botact } = require('../')

promisifyAll(RedisClient.prototype)
promisifyAll(Multi.prototype)

const client = createClient()
const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.GROUP_ID,
  token: process.env.TOKEN
})

const callApi = (body) => bot.listen({ body }, { end () {} })

describe('api', () => {
  it('call api', async () => {
    const body = await bot.api('users.get', { user_ids: 1 })

    expect(body).to.deep.equal({
      response: [{
        id: 1,
        first_name: 'Павел',
        last_name: 'Дуров'
      }]
    })
  })

  it('call execute', () => {
    bot.execute('users.get', {
      user_ids: 1
    }, (body) => {
      expect(body).to.deep.equal({
        response: [{
          id: 1,
          first_name: 'Павел',
          last_name: 'Дуров'
        }]
      })
    })
  })
})

describe('methods', () => {
  describe('uploadCover', () => {
    it('uploadCover', async () => {
      const response = await bot.uploadCover(path.join(__dirname, './files/cover.png'), {
        crop_x2: 1590,
        crop_y2: 400
      })

      const { images } = response

      expect(response).to.be.a('object').to.have.all.keys([ 'images' ])
      expect(images).to.be.a('array')
    })
  })

  describe('reply', () => {
    it('reply without permission', async () => {
      const body = await bot.reply(1, 'Hello, world!')

      expect(body).to.deep.equal({
        response: [{
          peer_id: 1,
          error: {
            code: 901,
            description: 'Can\'t send messages for users without permission'
          }
        }]
      })
    })

    it('reply with permission', async () => {
      const { response } = await bot.reply(145003487, 'Hello, world!')
      const [ message ] = response

      expect(response).to.be.a('array')
      expect(message).to.be.a('object').to.have.all.keys([ 'peer_id', 'message_id' ])
    })

    it('reply without message or attachment', async () => {
      try {
        const body = await bot.reply(1, null)
      } catch (error) {
        expect(error).to.deep.equal({
          error: {
            error_code: 100,
            error_msg: 'One of the parameters specified was missing or invalid: message is empty or invalid',
            method: 'messages.send'
          }
        })
      }
    })
  })
})

describe('options', () => {
  it('get options', () => {
    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'group_id' ])
  })

  it('set options', () => {
    bot.options = { foo: 'bar' }

    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'group_id', 'foo' ])
  })

  it('delete options', () => {
    bot.deleteOptions([ 'confirmation', 'foo' ])

    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'group_id' ])
  })
})

describe('events', () => {
  it('add before callback', async () => {
    await bot.before(() => 'foo')

    expect(bot.inital).eq('foo')
  })

  it('add middleware', () => {
    const middleware = (ctx) => {
      ctx.foo = 'bar'
    }

    bot.use(middleware)
    bot.on(({ foo }) => expect(foo).eq('bar'))

    callApi({
      type: 'message_new',
      object: {
        body: {
          user_id: Math.random()
        }
      }
    })

    expect(bot.actions.middlewares)
      .to.be.a('array')
      .to.include(middleware)
  })

  it('add command', () => {
    const command = 'example'
    const callback = (ctx) => expect(ctx).to.be.a('object')

    bot.command(command, callback)

    callApi({
      type: 'message_new',
      object: {
        body: command
      }
    })

    expect(bot.actions.commands).to.deep.include({
      command,
      callback
    })
  })

  it('add hears', () => {
    const command = /example/i
    const callback = (ctx) => expect(ctx).to.be.a('object')

    bot.hears(command, callback)

    callApi({
      type: 'message_new',
      object: {
        body: command.toString()
      }
    })

    expect(bot.actions.hears).to.deep.include({
      command,
      callback
    })
  })

  it('add on', () => {
    const callback = (ctx) => expect(ctx).to.be.a('object')

    bot.on(callback)

    callApi({
      type: 'message_new',
      object: {
        body: Math.random()
      }
    })

    expect(bot.actions.on).to.deep.include({
      type: 'message',
      callback
    })
  })

  it('add on [audio]', () => {
    const callback = (ctx) => expect(ctx).to.be.a('object')

    bot.on('audio', callback)

    callApi({
      type: 'message_new',
      object: {
        body: Math.random(),
        attachments: [ { type: 'audio' } ]
      }
    })

    expect(bot.actions.on).to.deep.include({
      type: 'audio',
      callback
    })
  })

  it('add event', () => {
    const event = 'group_join'
    const callback = (ctx) => expect(ctx).to.be.a('object')

    bot.event(event, callback)

    callApi({
      type: event,
      object: {
        user_id: Math.random()
      }
    })

    expect(bot.actions.events).to.deep.include({
      event,
      callback
    })
  })
})

describe('scene', () => {
  it('add scene', () => {
    const sceneName = 'simple'
    const callbacks = [ () => {}, () => {} ]

    bot.addScene(sceneName, callbacks)

    expect(bot.flow.scenes).to.deep.equal({ [sceneName]: callbacks })
  })

  it('join scene', async () => {
    const { token } = bot.options
    const id = 1
    const sceneName = 'simple'
    const sessionInital = { foo: 'bar' }

    await bot.joinScene({
      user_id: id,
      redis: client,
      flow: bot.flow
    }, sceneName, sessionInital)

    const {
      scene,
      step,
      session
    } = JSON.parse(await client.getAsync(`flow:${token}:${id}`))

    expect(scene).eq(sceneName)
    expect(step).eq(0)
    expect(session).to.deep.equal(sessionInital)
  })

  it('next scene', async () => {
    const { token } = bot.options
    const id = 1
    const sceneName = 'simple'
    const sessionInital = { foo: 'bar' }
    const sessionExtra = { bar: 'foo' }

    await bot.nextScene({
      user_id: id,
      redis: client,
      flow: bot.flow
    }, sessionExtra)

    const {
      scene,
      step,
      session
    } = JSON.parse(await client.getAsync(`flow:${token}:${id}`))

    expect(scene).eq(sceneName)
    expect(step).eq(1)
    expect(session).to.deep.equal({ ...sessionInital, ...sessionExtra })
  })

  it('leave scene', async () => {
    const { token } = bot.options
    const id = 1

    bot.leaveScene({
      user_id: id,
      redis: client
    })

    const flow = JSON.parse(await client.getAsync(`flow:${token}:${id}`))

    expect(flow).eq(null)
  })
})
