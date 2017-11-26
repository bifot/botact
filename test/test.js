const { expect } = require('chai')
const { RedisClient, createClient, Multi } = require('redis')
const { promisifyAll } = require('bluebird')
const { Botact } = require('../')

promisifyAll(RedisClient.prototype)
promisifyAll(Multi.prototype)

const client = createClient()

describe('botact', () => {
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

  it('add scene', () => {
    const scene = 'simple'
    const callbacks = [ () => {}, () => {} ]

    this.bot.addScene(scene, callbacks)

    expect(this.bot.flow.scenes).to.deep.equal({ [scene]: callbacks })
  })

  it('join scene', async () => {
    const userId = 1
    const sceneName = 'simple'
    const sessionInital = { foo: 'bar' }

    await this.bot.joinScene({
      user_id: userId,
      redis: client,
      flow: this.bot.flow
    }, sceneName, sessionInital)

    const {
      scene,
      step,
      session
    } = JSON.parse(await client.getAsync(`flow:${this.bot.options.token}:${userId}`))

    expect(scene).eq(sceneName)
    expect(step).eq(0)
    expect(session).to.deep.equal(sessionInital)
  })

  it('next scene', async () => {
    const userId = 1
    const sceneName = 'simple'
    const sessionInital = { foo: 'bar' }
    const sessionExtra = { bar: 'foo' }

    await this.bot.nextScene({
      user_id: userId,
      redis: client,
      flow: this.bot.flow
    }, sessionExtra)

    const {
      scene,
      step,
      session
    } = JSON.parse(await client.getAsync(`flow:${this.bot.options.token}:${userId}`))

    expect(scene).eq(sceneName)
    expect(step).eq(1)
    expect(session).to.deep.equal({ ...sessionInital, ...sessionExtra })
  })

  it('leave scene', async () => {
    const userId = 1
    const sceneName = 'simple'

    this.bot.leaveScene({
      user_id: userId,
      redis: client
    })

    const flow = JSON.parse(await client.getAsync(`flow:${this.bot.options.token}:${userId}`))

    expect(flow).eq(null)
  })
})
