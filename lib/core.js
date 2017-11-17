const redis = require('redis')

module.exports = class Botact {
  constructor (settings) {
    const { confirmation, token } = settings

    if (!confirmation) {
      throw 'confirmation is required'
    } else if (!token) {
      throw 'token is required'
    }

    this.flow = { scenes: {}, session: {}, timeout: settings.flowTimeout }
    this.actions = { commands: {}, hears: {}, events: {}, middlewares: {} }
    this.methods = {}
    this.settings = settings
    this.redis = settings.redisConfig ? redis.createClient(settings.redisConfig) : redis.createClient()

    Object.assign(this, {
      getOptions: require('./methods/options/get').bind(this),
      setOptions: require('./methods/options/set').bind(this),
      deleteOptions: require('./methods/options/delete').bind(this),
      use: require('./methods/middlewares').bind(this),
      command: require('./methods/command').bind(this),
      hears: require('./methods/hears').bind(this),
      on: require('./methods/on').bind(this),
      event: require('./methods/event').bind(this),
      reply: require('./methods/reply').bind(this),
      handler: require('./methods/handler').bind(this),
      uploadDocument: require('./methods/upload/uploadDocument').bind(this),
      uploadPhoto: require('./methods/upload/uploadPhoto').bind(this),
      uploadAndSaveCoverPhoto: require('./methods/upload/uploadAndSaveCoverPhoto').bind(this),
      addScene: require('./methods/flow/add').bind(this),
      joinScene: require('./methods/flow/join').bind(this),
      nextScene: require('./methods/flow/next').bind(this),
      leaveScene: require('./methods/flow/leave').bind(this),
      listen: require('./methods/listen').bind(this),
      api: require('./api'),
      execute: require('./methods/execute'),
      executeHandler: require('./utils/executeHandler'),
      getLastMessage: require('./utils/getLastMessage'),
      redisGet: require('./utils/redisGet')(this.redis)
    })

    setInterval(() => {
      this.executeHandler(this.methods)
      this.methods = {}
    }, (1000 / 20))
  }

  get options () {
    return this.getOptions()
  }

  set options (settings) {
    return this.setOptions(settings)
  }

  static execute (method, settings, token, callback) {
    return this.execute(method, settings, token, callback)
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

  reply (userId, message, attachment, callback) {
    return this.reply(userId, message, attachment, callback)
  }

  handler (ctx) {
    return this.handler(ctx)
  }

  uploadDocument (file) {
    return this.uploadDocument(file)
  }

  uploadPhoto (file) {
    return this.uploadPhoto(file)
  }

  uploadAndSaveCoverPhoto (file) {
    return this.uploadAndSaveCoverPhoto(file)
  }

  addScene (name, ...callbacks) {
    return this.addScene(name, callbacks)
  }

  joinScene (ctx, scene, body, step, now) {
    return this.joinScene(ctx, scene, body, step, now)
  }

  leaveScene (ctx) {
    return this.leaveScene(ctx)
  }

  nextScene (ctx) {
    return this.nextScene(ctx)
  }

  listen (req, res) {
    return this.listen(req, res)
  }

  callback (methods, body) {
    return this.callback(methods, body)
  }
}
