module.exports = function (req, res) {
  const {
    actions: {
      events
    },
    utils: {
      getLastMessage
    },
    settings: {
      secret: initSecret,
      confirmation
    }
  } = this
  const {
    type,
    secret,
    object,
    group_id
  } = req.body
  const { user_id } = object
  
  if (secret && secret !== initSecret) {
    return res.status(500).end('failed')
  }
  
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
  
  if (type === 'confirmation') {
    return res.end(confirmation)
  } else if (type === 'message_new') {
    this.handler(ctx)
  } else {
    const callback = events[type]
    
    if (callback !== undefined) {
      callback(ctx)
    }
  }
  
  return res.end('ok')
}
