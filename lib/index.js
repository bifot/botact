const api = require('./modules/api')

class Botact {
  constructor(options) {
    if (!options.confirmation || !options.group_id || !options.token) {
      throw new Error('Bot settings are incomplete.')
    }

    this.msg = []
    this.action = {}
    this.scenes = {}
    this.session = {}
    this.requests = { user: {}, group: {} }
    this.settings = options
    this.messages = { commands: [], hears: [] }
    this.method = {
      execute: require('./methods/execute')(this),
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
      const requests = this.requests
      const code = {
        user: requests.user && Object.keys(requests.user),
        group: requests.group && Object.keys(requests.group)
      }

      this.requests = { user: {}, group: {} }

      if (code.user.length && this.settings.admin) {
        api('execute', {
          code: `return [ ${code.user.join(',')} ];`,
          access_token: this.settings.admin
        }).then(body => {
          body.response.forEach((data, i) => {
            const callback = requests.user[Object.keys(requests.user)[i]]
            if (typeof callback === 'function') callback(data[0] || data)
          })
        }).catch(console.log)
      }

      if (code.group.length) {
        api('execute', {
          code: `return [ ${code.group.join(',')} ];`,
          access_token: this.settings.token
        }).then(body => {
          body.response.forEach((data, i) => {
            const callback = requests.group[Object.keys(requests.group)[i]]
            if (typeof callback === 'function') callback(data[0] || data)
          })
        }).catch(console.log)
      }
    }, 350)
  }

  get options() {
    return this.settings
  }

  execute(method, settings, type, callback) {
    return this.method.execute(method, settings, type, callback)
  }

  command(command, callback) {
    return this.method.command(command, callback)
  }

  hears(command, callback) {
    return this.method.hears(command, callback)
  }

  on(callback) {
    return this.method.on(callback)
  }

  event(event, callback) {
    return this.method.event(event, callback)
  }

  reply(user_id, message, attachments) {
    return this.method.reply(user_id, message, attachments)
  }

  handler(ctx) {
    return this.method.handler(ctx)
  }

  uploadDocument(file, type) {
    return this.method.upload.document(file, type)
  }

  uploadPhoto(file) {
    return this.method.upload.photo(file)
  }

  addScene(name, callbacks) {
    return this.method.scene.add(name, callbacks)
  }

  joinScene(ctx, session, current) {
    return this.method.scene.join(ctx, session, current)
  }

  leaveScene(ctx) {
    return this.method.scene.leave(ctx)
  }

  nextStepScene(ctx) {
    return this.method.scene.nextStep(ctx)
  }

  onScene(ctx) {
    return this.method.scene.on(ctx)
  }

  listen(req, res) {
    return this.method.listen(req, res)
  }
}

module.exports = Botact
