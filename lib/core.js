const api = require('./api')

module.exports = class Botact {
  constructor (options) {
    if (!options.confirmation || !options.token) {
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
      execute: require('./methods/execute')(this),
      sendByCallback: require('./methods/sendByCallback'),
      command: require('./methods/command')(this),
      hears: require('./methods/hears')(this),
      on: require('./methods/on')(this),
      event: require('./methods/event')(this),
      reply: require('./methods/reply')(this),
      handler: require('./methods/handler')(this),
      upload: {
        document: require('./methods/upload/document')(this),
        photo: require('./methods/upload/photo')(this)
      },
      scene: {
        add: require('./methods/scene/add')(this),
        join: require('./methods/scene/join')(this),
        nextStep: require('./methods/scene/nextStep')(this),
        leave: require('./methods/scene/leave')(this),
        on: require('./methods/scene/on')(this)
      },
      listen: require('./methods/listen')(this)
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
              .then(body => this.sendByCallback(methods, body))
              .catch(err => this.sendByCallback(methods, err))
          }
        } else if (Object.keys(methods.api).length) {
          api('execute', {
            code: `return [ ${Object.keys(methods.api).join(',')} ];`,
            access_token: methods.key
          })
            .then(body => this.sendByCallback(methods, body))
            .catch(err => this.sendByCallback(methods, err))
        }
      })
    }, 350)
  }

  get options () {
    return this.settings
  }

  addValueToOptions (object) {
    this.settings = Object.assign(this.settings, object)
    return this.settings
  }

  removeValueFromOptions (key) {
    delete this.settings[key]
    return
  }

  execute (method, settings, token, callback) {
    return this.method.execute(method, settings, token, callback)
  }

  sendByCallback (methods, body) {
    return this.method.sendByCallback(methods, body)
  }

  command (command, callback) {
    return this.method.command(command, callback)
  }

  hears (command, callback) {
    return this.method.hears(command, callback)
  }

  on (callback) {
    return this.method.on(callback)
  }

  event (event, callback) {
    return this.method.event(event, callback)
  }

  reply (userId, message, attachments) {
    return this.method.reply(userId, message, attachments)
  }

  handler (ctx) {
    return this.method.handler(ctx)
  }

  uploadDocument (path) {
    return this.method.upload.document(path)
  }

  uploadPhoto (path) {
    return this.method.upload.photo(path)
  }

  addScene (name, ...callbacks) {
    return this.method.scene.add(name, callbacks)
  }

  joinScene (ctx, session, step) {
    return this.method.scene.join(ctx, session, step)
  }

  leaveScene (ctx) {
    return this.method.scene.leave(ctx)
  }

  nextStepScene (ctx) {
    return this.method.scene.nextStep(ctx)
  }

  onScene (ctx) {
    return this.method.scene.on(ctx)
  }

  listen (req, res) {
    return this.method.listen(req, res)
  }
}
