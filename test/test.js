const { expect } = require('chai')
const { Botact } = require('../')

describe('Botact', () => {
  before(() => {
    this.bot = new Botact({
      confirmation: process.env.CONFIRMATION,
      token: process.env.TOKEN
    })
  })

  it('create bot', () => {
    expect(this.bot).to.be.a('object')
  })

  it('add before callback', async () => {
    await this.bot.before(() => 'foo')

    expect(this.bot.inital).eq('foo')
  })

  it('add middleware', () => {
    const middleware = (ctx) => ctx.foo = 'bar'

    this.bot.use(middleware)

    expect(this.bot.actions.middlewares)
      .to.be.a('array')
      .to.include(middleware)
  })

  it('get options', () => {
    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation' ])
  })

  it('set options', () => {
    this.bot.options = { foo: 'bar' }

    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'foo' ])
  })

  it('delete options', () => {
    this.bot.deleteOptions([ 'confirmation', 'foo' ])

    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token' ])
  })

  it('add command', () => {
    const command = 'example'
    const callback = () => {}

    this.bot.command(command, callback)

    const stringifyCommands = this.bot.actions.commands
      .map(({ command, callback }) => JSON.stringify({ command, callback: callback.toString() }))
    const stringifyCommand = JSON.stringify({ command, callback: callback.toString() })

    expect(stringifyCommands).to.include(stringifyCommand)
  })

  it('add hears', () => {
    const command = /example/i
    const callback = () => {}

    this.bot.hears(command, callback)

    const stringifyCommands = this.bot.actions.hears
      .map(({ command, callback }) => JSON.stringify({ command: command.toString(), callback: callback.toString() }))
    const stringifyCommand = JSON.stringify({ command: command.toString(), callback: callback.toString() })

    expect(stringifyCommands).to.include(stringifyCommand)
  })

  it('add reserved command', () => {
    const callback = () => {}

    this.bot.on(callback)

    expect(this.bot.actions.on).eq(callback)
  })
})
