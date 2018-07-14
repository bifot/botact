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
    } = settings

    if (!confirmation) {
      throw new Error('confirmation is required')
    } else if (!token) {
      throw new Error('token is required')
    }

    this.settings = {
      framework: 'express', // default framework
      ...settings
    }
    this.methods = []
    this.redis = !!redis && createRedis(redisConfig)
    this.flow = {
      scenes: {},
      session: {},
      timeout: flowTimeout,
    }
    this.actions = {
      commands: [],
      hears: [],
      events: [],
      on: [],
      middlewares: [],
    }

    for (const [methodName, method] of Object.entries(methods)) {
      this[methodName] = method.bind(this)
    }

    setInterval(() => {
      this.executeHandler(this.methods)
      this.methods = []
    }, (1000 / 20))
  }

  get options() {
    return this.getOptions()
  }

  set options(settings) {
    return this.setOptions(settings)
  }

  deleteOptions(keys) {
    return this.deleteOptions(keys)
  }

  use(callback) {
    return this.use(callback)
  }

  command(command, callback) {
    return this.command(command, callback)
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

  reply(user_id, message, attachment, keyboard) {
    return this.reply(user_id, message, attachment, keyboard)
  }

  handler(ctx) {
    return this.handler(ctx)
  }

  uploadDocument(file, peer_id, type) {
    return this.uploadDocument(file, peer_id, type)
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
