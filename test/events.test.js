const { expect } = require('chai')
const { bot, callApi } = require('./test.config.js')

describe('events', () => {
  it('add before', async () => {
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

  it('add on [w/ type=audio]', () => {
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
