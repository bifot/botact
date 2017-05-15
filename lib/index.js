class Botact {
  constructor (options) {
    if (!options.confirmation || !options.group_id || !options.token) {
      throw 'Bot settings are incomplete.'
    }

    this.msg = []
    this.members = []
    this.action = {}
    this.settings = options
    this.messages = { commands: [], hears: [] }
    this.method = {
      execute: require('./methods/execute')(this),
      follow: require('./methods/follow')(this),
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
      listen: require('./methods/listen')(this)
    }

    this.execute()
    this.follow()
  }

  execute () {
    return this.method.execute()
  }

  follow () {
    return this.method.follow()
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

  reply (user_id, message, attachments) {
    return this.method.reply(user_id, message, attachments)
  }

  handler (data) {
    return this.method.handler(data)
  }

  uploadDocument (file, type) {
    return this.method.upload.document(file, type)
  }

  uploadPhoto (file) {
    return this.method.upload.photo(file)
  }

  listen (req, res) {
    return this.method.listen(req, res)
  }
}

module.exports = Botact
