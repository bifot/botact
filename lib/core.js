const { RedisClient, createClient, Multi } = require('redis')
const methods = require('./methods')
const bluebird = require('bluebird')

bluebird.promisifyAll(RedisClient.prototype)
bluebird.promisifyAll(Multi.prototype)

module.exports = class Botact {
  constructor (settings) {
    const { confirmation, token, flowTimeout: timeout, redis, redisConfig = {} } = settings

    if (!confirmation) {
      throw new Error('confirmation is required')
    } else if (!token) {
      throw new Error('token is required')
    }

    this.flow = { scenes: {}, session: {}, timeout }
    this.actions = { commands: [], hears: [], events: [], on: [], middlewares: [] }
    this.methods = []
    this.settings = settings
    this.redis = redis && createClient(redisConfig)

    Object.assign(
      this,
      Object.entries(methods)
        .map(([ key, value ]) => ({ [key]: value.bind(this) }))
        .reduce((a, b) => ({ ...a, ...b }), {})
    )

    setInterval(() => {
      this.executeHandler(this.methods)
      this.methods = []
    }, (1000 / 20))
  }

  get options () {
    return this.getOptions()
  }

  set options (settings) {
    return this.setOptions(settings)
  }

  static execute (method, settings, callback) {
    return this.execute(method, settings, callback)
  }

  before (callback) {
    return this.before(callback)
  }

  deleteOptions (keys) {
    return this.deleteOptions(keys)
  }

  use (callback) {
    return this.use(callback)
  }

  command (command, callback) {
    return this.command(command, callback)
  }

  hears (command, callback) {
    return this.hears(command, callback)
  }

  on (callback) {
    return this.on(callback)
  }

  event (event, callback) {
    return this.event(event, callback)
  }

  reply (user_id, message, attachment) {
    return this.reply(user_id, message, attachment)
  }

  handler (ctx) {
    return this.handler(ctx)
  }

  uploadDocument (file, peer_id, type) {
    return this.uploadDocument(file, peer_id, type)
  }

  uploadPhoto (file, peer_id) {
    return this.uploadPhoto(file, peer_id)
  }

  uploadCover (file, settings) {
    return this.uploadCover(file, settings)
  }

  addScene (name, ...callbacks) {
    return this.addScene(name, callbacks)
  }

  joinScene (ctx, scene, session, step, instantly) {
    return this.joinScene(ctx, scene, session, step, instantly)
  }

  leaveScene (ctx) {
    return this.leaveScene(ctx)
  }

  nextScene (ctx, session) {
    return this.nextScene(ctx, session)
  }

  listen (req, res) {
    return this.listen(req, res)
  }

  callback (methods, body) {
    return this.callback(methods, body)
  }
}
