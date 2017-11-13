const { expect } = require('chai')
const { Botact } = require('../')
const config = require('../config')

describe('Botact', () => {
  before(() => {
    this.bot = new Botact(config)
  })

  it('CREATE bot', () => {
    const { bot } = this

    expect(bot).to.be.a('object')
  })

  it('GET options', () => {
    const { bot } = this
    const options = bot.options

    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation' ])
  })

  it('SET options', () => {
    const { bot } = this

    bot.options = { foo: 'bar' }

    const options = bot.options

    expect(options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'foo' ])
  })

  it('DELETE options', () => {
    const { bot } = this

    bot.deleteOptions([ 'confirmation', 'foo' ])

    const options = bot.options

    expect(options)
      .to.be.a('object')
      .to.have.all.keys([ 'token' ])
  })

  it('ADD command', () => {
    const { bot } = this
    const command = 'example'
    const callback = (ctx) => expect(ctx).to.be.a('object')
    const { actions: { commands } } = bot.command(command, callback)

    expect(commands)
      .to.be.a('object')
      .to.have.property(command)

    bot.listen({
      body: {
        type: 'message_new',
        object: {
          body: command
        }
      }
    }, {
      end: () => {}
    })
  })

  it('ADD hears', () => {
    const { bot } = this
    const command = 'example'
    const callback = (ctx) => expect(ctx).to.be.a('object')
    const { actions: { hears } } = bot.hears(command, callback)

    expect(hears)
      .to.be.a('object')
      .to.have.property(command)

    bot.listen({
      body: {
        type: 'message_new',
        object: {
          body: 'This is example!'
        }
      }
    }, {
      end: () => {}
    })
  })

  it('ADD hears [regex]', () => {
    const { bot } = this
    const command = /example/i
    const callback = (ctx) => expect(ctx).to.be.a('object')
    const { actions: { hears } } = bot.hears(command, callback)

    expect(hears)
      .to.be.a('object')
      .to.have.property(command)

    bot.listen({
      body: {
        type: 'message_new',
        object: {
          body: 'This is example!'
        }
      }
    }, {
      end: () => {}
    })
  })

  it('ADD reserved command', () => {
    const { bot } = this
    const callback = (ctx) => expect(ctx).to.be.a('object')
    const { actions: { on } } = bot.on(callback)

    expect(on).to.be.a('function')

    bot.listen({
      body: {
        type: 'message_new',
        object: {
          body: 'Start reserved callback'
        }
      }
    }, {
      end: () => {}
    })
  })

  it('SEND message', async () => {
    const { bot } = this

    bot.reply(145003487, 'Hello, world!', null, (body) => {
      expect(body).to.be.a('number')
    })
  })
})
