const { expect } = require('chai')
const path = require('path')
const { RedisClient, createClient, Multi } = require('redis')
const { promisifyAll } = require('bluebird')
const { Botact } = require('../')

promisifyAll(RedisClient.prototype)
promisifyAll(Multi.prototype)

const client = createClient()

describe('botact', function () {
  this.timeout(5000)

  before(() => {
    this.bot = new Botact({
      confirmation: process.env.CONFIRMATION,
      group_id: process.env.GROUP_ID,
      token: process.env.TOKEN
    })

    this.sendRequest = (body) => this.bot.listen({ body }, { end() {} })
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
    this.bot.on(({ foo }) => expect(foo).eq('bar'))

    this.sendRequest({
      type: 'message_new',
      object: {
        body: {
          user_id: Math.random()
        }
      }
    })

    expect(this.bot.actions.middlewares)
      .to.be.a('array')
      .to.include(middleware)
  })

  it('get options', () => {
    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'group_id' ])
  })

  it('set options', () => {
    this.bot.options = { foo: 'bar' }

    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'group_id', 'foo' ])
  })

  it('delete options', () => {
    this.bot.deleteOptions([ 'confirmation', 'foo' ])

    expect(this.bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'group_id' ])
  })

  it('add command', () => {
    const command = 'example'
    const callback = (ctx) => expect(ctx).to.be.a('object')

    this.bot.command(command, callback)

    this.sendRequest({
      type: 'message_new',
      object: {
        body: command
      }
    })

    const stringifyCommands = this.bot.actions.commands
      .map(({ command, callback }) => JSON.stringify({ command, callback: callback.toString() }))
    const stringifyCommand = JSON.stringify({ command, callback: callback.toString() })

    expect(stringifyCommands).to.include(stringifyCommand)
  })

  it('add hears', () => {
    const command = /example/i
    const callback = (ctx) => expect(ctx).to.be.a('object')

    this.bot.hears(command, callback)

    this.sendRequest({
      type: 'message_new',
      object: {
        body: command.toString()
      }
    })

    const stringifyCommands = this.bot.actions.hears
      .map(({ command, callback }) => JSON.stringify({ command: command.toString(), callback: callback.toString() }))
    const stringifyCommand = JSON.stringify({ command: command.toString(), callback: callback.toString() })

    expect(stringifyCommands).to.include(stringifyCommand)
  })

  it('add on', () => {
    const callback = (ctx) => expect(ctx).to.be.a('object')

    this.bot.on(callback)

    this.sendRequest({
      type: 'message_new',
      object: {
        body: Math.random()
      }
    })

    expect(this.bot.actions.on).eq(callback)
  })

  it('add event', () => {
    const event = 'group_join'
    const callback = (ctx) => expect(ctx).to.be.a('object')

    this.bot.event(event, callback)

    this.sendRequest({
      type: event,
      object: {
        user_id: Math.random()
      }
    })

    const stringifyEvents = this.bot.actions.events
      .map(({ command, callback }) => JSON.stringify({ event, callback: callback.toString() }))
    const stringifyEvent = JSON.stringify({ event, callback: callback.toString() })

    expect(stringifyEvents).to.include(stringifyEvent)
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

  it('upload photo', async () => {
    const photo = await this.bot.uploadPhoto(path.join(__dirname, './files/cover.png'))

    expect(photo).to.be.a('object').to.contains.keys([ 'id', 'album_id', 'owner_id', 'user_id' ])
  })

  it('upload cover', async () => {
    const cover = await this.bot.uploadCover(path.join(__dirname, './files/cover.png'), {
      crop_x2: 1590,
      crop_y2: 400
    })

    const { images } = cover

    expect(cover).to.be.a('object').to.have.all.keys([ 'images' ])
    expect(images).to.be.a('array')
  })
})
