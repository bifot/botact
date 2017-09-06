module.exports = class Botact {
  constructor (settings) {
    if (!(settings.confirmation && settings.token)) {
      throw new Error('Bot settings are incomplete.')
    }

    Object.assign(this, {
      getOptions: require('./methods/options/get').bind(this),
      setOptions: require('./methods/options/set').bind(this),
      deleteOptions: require('./methods/options/delete').bind(this),
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
    return this.getOptions()
  }

  setOptions (settings) {
    return this.setOptions(settings)
  }

  deleteOptions (settings) {
    return this.deleteOptions(settings)
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

  reply (userId, message, attachment) {
    return this.reply(userId, message, attachment)
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

  joinScene (ctx, session, step) {
    return this.joinScene(ctx, session, step)
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

  execute (method, settings, token, callback) {
    return this.execute(method, settings, token, callback)
  }

  _callback (methods, body) {
    return this._callback(methods, body)
  }
}
