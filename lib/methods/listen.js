module.exports = async function(...args) {
  const { inital, settings, actions } = this
  const { confirmation, framework, secret: token } = settings
  const { type, secret, object, group_id } = framework === 'koa'
    ? args[0].request.body
    : args[0].body

  try {
    if (type === 'confirmation') {
      if (framework === 'koa') {
        args[0].body = confirmation + ''
      } else {
        args[1].end(confirmation + '')
      }
    }

    if (secret && secret !== token) {
      if (framework === 'koa') {
        args[0].status = 403
        args[0].body = 'Access denied.'
      } else {
        args[1].status(403).end('Access denied.')
      }

      return this
    }

    const { events, middlewares } = actions
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
      reply: (...args) => this.reply(object.user_id || object.peer_id, ...args),
      sendMessage: this.reply,
    }

    ctx.throw = (...args) => this.throw(ctx, ...args)
    ctx.assert = (...args) => this.assert(ctx, ...args)

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

    if (framework === 'koa') {
      args[0].body = 'ok'
    } else {
      args[1].end('ok')
    }

    return this
  } catch (err) {
    if (framework === 'koa') {
      args[1](err)
    } else {
      args[2](err)
    }
  }
}
