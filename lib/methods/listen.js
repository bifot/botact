module.exports = async function (req, res, callback) {
  try {
    const { type, secret } = req.body
    const { inital, settings, actions } = this
    const { confirmation, secret: token } = settings

    if (type === 'confirmation') {
      res.end(confirmation.toString())

      return this
    } else if (secret && secret !== token) {
      res.status(500).end('access denied')

      return this
    }

    const { events, middlewares } = actions
    const { object, group_id } = req.body
    const { user_id } = object
    const forwarded = this.getLastMessage(object)

    const allowedCtxMethods = ['api', 'reply', 'uploadDocument', 'uploadPhoto', 'uploadCover', 'execute', 'flow', 'redis']
    const ctxMethods = Object.keys(this)
      .filter(key => allowedCtxMethods.includes(key))
      .reduce((obj, key) => {
        obj[key] = this[key]
        return obj
      }, {})

    const ctx = {
      ...object,
      ...ctxMethods,
      inital,
      group_id,
      forwarded,
      body: object.body || forwarded.body,
      scene: {
        join: (scene, body, step, instantly) => this.joinScene(ctx, scene, body, step, instantly),
        next: (body) => this.nextScene(ctx, body),
        leave: () => this.leaveScene(ctx)
      },
      reply: (message, attachment) => this.reply(user_id, message, attachment),
      sendMessage: (user_id, message, attachment) => this.reply(user_id, message, attachment)
    }

    if (middlewares.length) {
      await Promise.all(middlewares.map(callback => callback(ctx)))
    }

    if (type === 'message_new') {
      this.handler(ctx)
    } else {
      const [ event ] = events.filter(({ event }) => event === type)

      if (event) {
        event.callback(ctx)
      }
    }

    res.end('ok')
  } catch (err) {
    callback(err)
  }
}
