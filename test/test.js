const { expect } = require('chai')
const { Botact } = require('../')
const config = require('../config')

describe('Botact', () => {
  before(() => {
    this.bot = new Botact(config)
  })

  it('CREATE bot', () => {
    expect(this.bot).to.be.a('object')
  })

  it('ADD before callback', async () => {
    const date = new Date()

    await this.bot.before(() => date)

    this.bot.command('before', ({ inital }) => expect(inital).eq(date))
    this.bot.listen({
      body: {
        type: 'message_new',
        object: {
          body: 'before'
        }
      }
    }, {
      end: () => {}
    })
  })

  it('GET options', () => {
    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation' ])
  })

  it('SET options', () => {
    this.bot.options = { foo: 'bar' }

    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'foo' ])
  })

  it('DELETE options', () => {
    this.bot.deleteOptions([ 'confirmation', 'foo' ])

    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token' ])
  })

  it('ADD command', () => {
    const command = 'example'

    this.bot.command(command, (ctx) => expect(ctx).to.be.a('object'))

    expect(this.bot.actions.commands)
      .to.be.a('object')
      .to.have.property(command)

    this.bot.listen({
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
    const command = 'example'

    this.bot.hears(command, (ctx) => expect(ctx).to.be.a('object'))

    expect(this.bot.actions.hears)
      .to.be.a('object')
      .to.have.property(command)

    this.bot.listen({
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
    const callback = (ctx) => expect(ctx).to.be.a('object')

    this.bot.on(callback)

    expect(this.bot.actions.on).to.be.a('function')

    this.bot.listen({
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
    this.bot.reply(145003487, 'Hello, world!', null, (body) => {
      expect(body).to.be.a('number')
    })
  })
})
