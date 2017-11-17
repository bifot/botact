module.exports = function (req, res) {
  const { type, secret } = req.body
  const { confirmation, secret: token } = this.settings

  if (type === 'confirmation') {
    return res.end(confirmation)
  } else if (secret && secret !== token) {
    return res.status(500).end('access denied')
  }

  const { events } = this.actions
  const { object, object: { user_id }, group_id } = req.body
  const forwarded = this.getLastMessage(object)

  const ctx = {
    ...object,
    ...this,
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

  if (type === 'message_new') {
    this.handler(ctx)
  } else {
    const callback = events[type]

    if (callback !== undefined) {
      callback(ctx)
    }
  }

  return res.end('ok')
}
