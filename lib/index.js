class Botact {
  constructor(options) {
    if (!options.confirmation || !options.group_id || !options.token) {
      throw 'Bot settings are incomplete.'
    }

    this.msg = []
    this.followers = []
    this.action = {}
    this.scenes = {}
    this.session = {}
    this.settings = options
    this.messages = { commands: [], hears: [] }
    this.method = {
      execute: require('./methods/execute')(this),
      followers: require('./methods/followers')(this),
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

    if (this.settings.sub) {
      setInterval(() => {
        this.method.followers().then(body => {
          body.members.forEach(follower => this.handler(follower.ctx))
          body.viewers.forEach(viewer => this.reply(viewer.user_id, this.settings.sub))
        })
      }, 350)
    }

    setInterval(() => {
      this.method.execute().then(body => {
        if (this.settings.log) console.log(JSON.stringify(body, null, 2))
      }).catch(err => {
        if (this.settings.log) console.log(JSON.stringify(err, null, 2))
      })
    }, 350)
  }

  get options() {
    return this.settings
  }

  execute() {
    return this.method.execute()
  }

  follow() {
    return this.method.follow()
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
