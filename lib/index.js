const assert = require('assert')
const createRedis = require('./utils/redis')
const methods = require('./methods')

class Botact {
  constructor(settings) {
    const {
      confirmation,
      token,
      redis,
      flowTimeout,
      redisConfig = {},
      executeTimeout = 50,
      framework = 'express'
    } = settings

    assert(confirmation, 'You must set confirmation code in settings')
    assert(token, 'You must set token in settings')
    assert(typeof confirmation === 'string', 'Confirmation code must be a string')
    assert(typeof token === 'string', 'Token must be a string')

    this.settings = { ...settings, framework }
    this.redis = !!redis && createRedis(redisConfig)
    this.flow = {
      scenes: {},
      session: {},
      timeout: flowTimeout,
    }
    this.methods = []
    this.actions = {
      commands: [],
      hears: [],
      events: [],
      on: [],
      middlewares: [],
    }
    this.catch = (ctx, err) => {
      console.error(`❌ Botact Error: ${typeof err === 'object' ? JSON.stringify(err) : err}`)
    }

    for (const [methodName, method] of Object.entries(methods)) {
      this[methodName] = method.bind(this)
    }

    setInterval(() => {
      this.executeHandler(this.methods)
      this.methods = []
    }, executeTimeout)
  }

  get options() {
    return this.getOptions()
  }

  set options(settings) {
    return this.setOptions(settings)
  }

  use(callback) {
    return this.use(callback)
  }

  command(...args) {
    return this.command(...args)
  }

  hears(command, callback) {
    return this.hears(command, callback)
  }

  on(callback) {
    return this.on(callback)
  }

  event(event, callback) {
    return this.event(event, callback)
  }

  reply(userId, message, attachment, keyboard) {
    return this.reply(userId, message, attachment, keyboard)
  }

  catch(handler) {
    return this.catch(handler)
  }

  throw(ctx, error) {
    return this.throw(ctx, error)
  }

  assert(ctx, value, error) {
    return this.assert(ctx, value, error)
  }

  handler(ctx) {
    return this.handler(ctx)
  }

  uploadDocument(file, peerId, type) {
    return this.uploadDocument(file, peerId, type)
  }

  uploadPhoto(file, peer_id) {
    return this.uploadPhoto(file, peer_id)
  }

  uploadCover(file, settings) {
    return this.uploadCover(file, settings)
  }

  addScene(name, ...callbacks) {
    return this.addScene(name, callbacks)
  }

  joinScene(ctx, scene, session, step, instantly) {
    return this.joinScene(ctx, scene, session, step, instantly)
  }

  leaveScene(ctx) {
    return this.leaveScene(ctx)
  }

  nextScene(ctx, session) {
    return this.nextScene(ctx, session)
  }

  listen(...args) {
    return this.listen(...args)
  }

  callback(methods, body) {
    return this.callback(methods, body)
  }
}

module.exports = Botact
