module.exports = function (ctx) {
  return new Promise((resolve, reject) => {
    if (this.flow.scenes[ctx.user_id] && this.flow.scenes[ctx.user_id].callback) {
      const session = this.flow.scenes[ctx.user_id]

      return session.callback[session.current]({
        ...ctx,
        session: this.flow.scenes[ctx.user_id].body
      })
    }

    const command = ctx.body.toLowerCase()

    if (this.actions.commands[command]) {
      return this.actions.commands[command](ctx)
    }

    if (!Object.keys(this.actions.hears).length) {
      if (typeof this.actions.on === 'function') {
        resolve(this.actions.on(ctx))
      }

      reject('Bot can\'t found reserved reply.')
    }

    const entries = Object.keys(this.actions.hears)
      .filter(string => new RegExp(string, 'i').test(command))

    if (entries.length) {
      resolve(this.actions.hears[entries[0]](ctx))
    }

    if (typeof this.actions.on === 'function') {
      resolve(this.actions.on(ctx))
    }

    reject('Bot can\'t found reserved reply.')
  })
}
