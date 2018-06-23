module.exports = async function listen(req, res, callback) {
  try {
    const { type, secret } = req.body
    const { inital, settings, actions } = this
    const { confirmation, secret: token } = settings

    if (type === 'confirmation') {
      res.end(confirmation.toString())

      return this
    }

    if (secret && secret !== token) {
      res.status(500).end('access denied')

      return this
    }

    const { events, middlewares } = actions
    const { object, group_id } = req.body
    const { user_id } = object
    const forwarded = this.getLastMessage(object)
    const ctx = {
      ...this,
      ...object,
      inital,
      group_id,
      forwarded,
      body: object.body || forwarded.body,
      scene: {
        join: (...args) => this.joinScene(ctx, ...args),
        next: (...args) => this.nextScene(ctx, ...args),
        leave: () => this.leaveScene(ctx),
      },
      reply: (...args) => this.reply(user_id, ...args),
      sendMessage: this.reply,
    }

    if (middlewares.length) {
      await Promise.all(middlewares.map(callback => callback(ctx)))
    }

    if (type === 'message_new') {
      this.handler(ctx)
    } else {
      const [event] = events.filter(({ event }) => event === type)

      if (event) {
        event.callback(ctx)
      }
    }

    res.end('ok')
  } catch (err) {
    callback(err)
  }
}
