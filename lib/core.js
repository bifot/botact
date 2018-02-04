const { RedisClient, createClient, Multi } = require('redis')
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

    this.api = require('./api')
    this.getOptions = require('./methods/options/get').bind(this)
    this.setOptions = require('./methods/options/set').bind(this)
    this.deleteOptions = require('./methods/options/delete').bind(this)
    this.before = require('./methods/before').bind(this)
    this.use = require('./methods/use').bind(this)
    this.command = require('./methods/command').bind(this)
    this.hears = require('./methods/hears').bind(this)
    this.on = require('./methods/on').bind(this)
    this.event = require('./methods/event').bind(this)
    this.reply = require('./methods/reply').bind(this)
    this.handler = require('./methods/handler').bind(this)
    this.uploadDocument = require('./methods/upload/document').bind(this)
    this.uploadPhoto = require('./methods/upload/photo').bind(this)
    this.uploadCover = require('./methods/upload/cover').bind(this)
    this.addScene = require('./methods/flow/add').bind(this)
    this.joinScene = require('./methods/flow/join').bind(this)
    this.nextScene = require('./methods/flow/next').bind(this)
    this.leaveScene = require('./methods/flow/leave').bind(this)
    this.listen = require('./methods/listen').bind(this)
    this.execute = require('./methods/execute').bind(this)
    this.executeHandler = require('./utils/executeHandler')
    this.getLastMessage = require('./utils/getLastMessage')

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

  joinScene (ctx, scene, session, step, now) {
    return this.joinScene(ctx, scene, session, step, now)
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
