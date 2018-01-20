module.exports = async function (req, res) {
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

  const ctx = {
    ...object,
    ...this,
    inital,
    group_id,
    forwarded: forwarded,
    body: forwarded.body,
    scene: {
      join: (scene, body, step, now) => this.joinScene(ctx, scene, body, step, now),
      next: (body) => this.nextScene(ctx, body),
      leave: () => this.leaveScene(ctx)
    },
    reply: (message, attachment, callback) => this.reply(user_id, message, attachment, callback),
    sendMessage: (user_id, message, attachment, callback) => this.reply(user_id, message, attachment, callback)
  }

  if (middlewares.length) {
    await Promise.all(middlewares.map(callback => callback(ctx)))
  }

  if (type === 'message_new') {
    this.handler(ctx)
  } else {
    const [ event ] = events.filter(({ event }) => event === type)

    if (event !== undefined) {
      event.callback(ctx)
    }
  }

  res.end('ok')

  return this
}
