module.exports = function (req, res) {
  const { type, secret } = req.body
  const { confirmation, secret: token } = this.settings
  
  if (type === 'confirmation') {
    return res.end(confirmation)
  } else if (secret && secret !== token) {
    return res.status(500).end('access denied')
  }
  
  const { events } = this.actions
  const { getLastMessage } = this.utils
  const { object, object: { user_id }, group_id } = req.body
  
  const ctx = {
    ...object,
    ...this,
    group_id,
    forwarded: getLastMessage(object),
    body: getLastMessage(object).body,
    scene: {
      join: (scene, body, step) => this.joinScene(ctx, scene, body, step),
      next: (body) => this.nextScene(ctx, body),
      leave: () => this.leaveScene(ctx)
    },
    reply: (message, attachment) => this.reply(user_id, message, attachment),
    sendMessage: (user_id, message, attachment) => this.reply(user_id, message, attachment)
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
