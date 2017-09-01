module.exports = class Botact {
  constructor (settings) {
    if (!(settings.confirmation && settings.token)) {
      throw new Error('Bot settings are incomplete.')
    }

    Object.assign(this, {
      api: require('./api'),
      getOptions: require('./methods/options/get'),
      setOptions: require('./methods/options/set'),
      deleteOptions: require('./methods/options/delete'),
      command: require('./methods/command'),
      hears: require('./methods/hears'),
      on: require('./methods/on'),
      event: require('./methods/event'),
      reply: require('./methods/reply'),
      handler: require('./methods/handler'),
      uploadDocument: require('./methods/upload/uploadDocument'),
      uploadPhoto: require('./methods/upload/uploadPhoto'),
      uploadAndSaveCoverPhoto: require('./methods/upload/uploadAndSaveCoverPhoto'),
      addScene: require('./methods/scene/add'),
      joinScene: require('./methods/scene/join'),
      nextScene: require('./methods/scene/next'),
      leaveScene: require('./methods/scene/leave'),
      onScene: require('./methods/scene/on'),
      listen: require('./methods/listen'),
      execute: require('./methods/execute'),
      _callback: require('./methods/_callback')
    })

    this.flow = { scenes: {}, session: {} }
    this.actions = { commands: [], hears: [], events: [] }
    this.methods = { user: {}, group: {} }
    this.settings = settings

    setInterval(() => {
      const requests = Object.keys(this.methods).map((key, i) => {
        return {
          key: Object.keys(this.methods)[i],
          api: this.methods[key]
        }
      })

      this.methods = { user: {}, group: {} }

      requests.forEach((methods) => {
        if (Object.keys(methods.api).length > 25) {
          for (let i = 0, j = Math.ceil(Object.keys(methods.api).length / 25); i < j; i++) {
            this.api('execute', {
              code: `return [ ${Object.keys(methods.api).slice(i * 25, i * 25 + 25).join(',')} ];`,
              access_token: methods.key
            })
              .then(body => this._callback(methods, body))
              .catch(err => this._callback(methods, err))
          }
        } else if (Object.keys(methods.api).length) {
          this.api('execute', {
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
    return this.getOptions.call(this)
  }

  setOptions (settings) {
    return this.setOptions.call(this, settings)
  }

  deleteOptions (settings) {
    return this.deleteOptions.call(this, settings)
  }

  execute (method, settings, token, callback) {
    return this.execute.call(this, method, settings, token, callback)
  }

  command (command, callback) {
    return this.command.call(this, command, callback)
  }

  hears (command, callback) {
    return this.hears.call(this, command, callback)
  }

  on (callback) {
    return this.on.call(this, callback)
  }

  event (event, callback) {
    return this.event.call(this, event, callback)
  }

  reply (userId, message, attachment) {
    return this.reply.call(this, userId, message, attachment)
  }

  uploadDocument (file) {
    return this.uploadDocument.call(this, file)
  }

  uploadPhoto (file) {
    return this.uploadPhoto.call(this, file)
  }

  uploadAndSaveCoverPhoto (file) {
    return this.uploadAndSaveCoverPhoto.call(this, file)
  }

  addScene (name, ...callbacks) {
    return this.addScene.call(this, name, callbacks)
  }

  joinScene (ctx, session, step) {
    return this.joinScene.call(this, ctx, session, step)
  }

  leaveScene (ctx) {
    return this.leaveScene.call(this, ctx)
  }

  nextScene (ctx) {
    return this.nextScene.call(this, ctx)
  }

  onScene (ctx) {
    return this.onScene.call(this, ctx)
  }

  handler (ctx) {
    return this.handler.call(this, ctx)
  }

  listen (req, res) {
    return this.listen.call(this, req, res)
  }

  _callback (methods, body) {
    return this._callback(methods, body)
  }
}
