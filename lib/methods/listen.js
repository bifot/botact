module.exports = async function listen(...args) {
  let body

  const { inital, settings, actions } = this
  const { confirmation, framework, secret: token } = settings

  switch (framework) {
    case 'express':
      body = args[0].body
      break
    case 'koa':
      body = args[0].request.body
      break
  }

  const { type, secret } = body

  try {
    if (type === 'confirmation') {
      switch (framework) {
        case 'express':
          args[1].end(confirmation + '')
          break
        case 'koa':
          args[0].body = confirmation + ''
          break
      }

      return this
    }

    if (secret && secret !== token) {
      switch (framework) {
        case 'express':
          args[1].status(403).end('Access denied.')
          break
        case 'koa':
          args[0].status = 403
          args[0].body = 'Access denied.'
          break
      }

      return this
    }

    const { events, middlewares } = actions
    const { object, group_id } = body
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

    switch (framework) {
      case 'express':
        args[1].end('ok')
        break
      case 'koa':
        args[0].body = 'ok'
        break
    }

    return this
  } catch (err) {
    switch (framework) {
      case 'express':
        return args[2](err)
      case 'koa':
        return args[1](err)
    }
  }
}
