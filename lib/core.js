const api = require('./api')

module.exports = class Botact {
  constructor (options) {
    if (!(options.confirmation && options.token)) {
      throw new Error('Bot settings are incomplete.')
    }

    this.msg = []
    this.scenes = {}
    this.session = {}
    this.action = {}
    this.settings = options
    this.requests = { user: {}, group: {} }
    this.messages = { commands: [], hears: [] }
    this.method = {
      getOptions: require('./methods/options/get'),
      setOptions: require('./methods/options/set'),
      deleteOptions: require('./methods/options/delete'),
      execute: require('./methods/execute'),
      command: require('./methods/command'),
      hears: require('./methods/hears'),
      on: require('./methods/on'),
      event: require('./methods/event'),
      reply: require('./methods/reply'),
      handler: require('./methods/handler'),
      uploadDocument: require('./methods/upload/document'),
      uploadPhoto: require('./methods/upload/photo'),
      addScene: require('./methods/scene/add'),
      joinScene: require('./methods/scene/join'),
      nextScene: require('./methods/scene/next'),
      leaveScene: require('./methods/scene/leave'),
      onScene: require('./methods/scene/on'),
      listen: require('./methods/listen'),
      _callback: require('./methods/_callback')
    }

    setInterval(() => {
      const requests = Object.keys(this.requests).map((key, i) => {
        return {
          key: Object.keys(this.requests)[i],
          api: this.requests[key]
        }
      })

      this.requests = { user: {}, group: {} }

      requests.forEach((methods) => {
        if (Object.keys(methods.api).length > 25) {
          for (let i = 0, j = Math.ceil(Object.keys(methods.api).length / 25); i < j; i++) {
            api('execute', {
              code: `return [ ${Object.keys(methods.api).slice(i * 25, i * 25 + 25).join(',')} ];`,
              access_token: methods.key
            })
              .then(body => this._callback(methods, body))
              .catch(err => this._callback(methods, err))
          }
        } else if (Object.keys(methods.api).length) {
          api('execute', {
            code: `return [ ${Object.keys(methods.api).join(',')} ];`,
            access_token: methods.key
          })
            .then(body => this._callback(methods, body))
            .catch(err => this._callback(methods, err))
        }
      })
    }, 350)
  }

  getOptions () {
    return this.method.getOptions.call(this)
  }

  setOptions (settings) {
    return this.method.setOptions.call(this, settings)
  }

  deleteOptions (settings) {
    return this.method.deleteOptions.call(this, settings)
  }

  execute (method, settings, token, callback) {
    return this.method.execute.call(this, method, settings, token, callback)
  }

  command (command, callback) {
    return this.method.command.call(this, command, callback)
  }

  hears (command, callback) {
    return this.method.hears.call(this, command, callback)
  }

  on (callback) {
    return this.method.on.call(this, callback)
  }

  event (event, callback) {
    return this.method.event.call(this, event, callback)
  }

  reply (userId, message, attachment) {
    return this.method.reply.call(this, userId, message, attachment)
  }

  uploadDocument (file) {
    return this.method.uploadDocument.call(this, file)
  }

  uploadPhoto (file) {
    return this.method.uploadPhoto.call(this, file)
  }

  addScene (name, ...callbacks) {
    return this.method.addScene.call(this, name, callbacks)
  }

  joinScene (ctx, session, step) {
    return this.method.joinScene.call(this, ctx, session, step)
  }

  leaveScene (ctx) {
    return this.method.leaveScene.call(this, ctx)
  }

  nextScene (ctx) {
    return this.method.nextScene.call(this, ctx)
  }

  onScene (ctx) {
    return this.method.onScene.call(this, ctx)
  }

  handler (ctx) {
    return this.method.handler.call(this, ctx)
  }

  listen (req, res) {
    return this.method.listen.call(this, req, res)
  }

  _callback (methods, body) {
    return this.method._callback(methods, body)
  }
}
