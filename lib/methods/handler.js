module.exports = (self) => {
  return (ctx) => {
    if (!ctx) return false

    const command = ctx.body.toLowerCase()

    if (self.messages.commands[command]) {
      return self.messages.commands[command](ctx)
    }

    if (self.scenes[ctx.user_id]) {
      const current = Object.keys(self.scenes[ctx.user_id])[self.scenes[ctx.user_id].current]
      return self.scenes[ctx.user_id][current](ctx)
    }

    const method = {}

    Object.keys(self.messages.hears).forEach(command => {
      method[command] = self.messages.hears[command]
    })

    if (Object.keys(method).length === 0) {
      if (typeof self.messages.on === 'function') {
        return self.messages.on(ctx)
      }

      return console.log('Bot can\'t found reserved reply.')
    }

    const regexp = Object.keys(method).filter(regexp => {
      return new RegExp(regexp, 'i').test(command)
    })

    if (regexp.length !== 0) {
      return method[regexp[0]](ctx)
    }

    if (typeof self.messages.on === 'function') {
      return self.messages.on(ctx)
    }

    return console.log('Bot can\'t found reserved reply.')
  }
}
