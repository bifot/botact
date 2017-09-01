module.exports = function(ctx) {
  if (this.flow.scenes[ctx.user_id]) {
    const current = Object.keys(this.flow.scenes[ctx.user_id])[this.flow.scenes[ctx.user_id].current]
    return this.flow.scenes[ctx.user_id][current](ctx)
  }

  const command = ctx.body.toLowerCase()

  if (this.actions.commands[command]) {
    return this.actions.commands[command](ctx)
  }

  const method = {}

  Object.keys(this.actions.hears).forEach((command) => {
    method[command] = this.actions.hears[command]
  })

  if (Object.keys(method).length === 0) {
    if (typeof this.actions.on === 'function') {
      return this.actions.on(ctx)
    }

    return console.error('Bot can\'t found reserved reply.')
  }

  const regexp = Object.keys(method).filter((regexp) => {
    return new RegExp(regexp, 'i').test(command)
  })

  if (regexp.length !== 0) {
    return method[regexp[0]](ctx)
  }

  if (typeof this.actions.on === 'function') {
    return this.actions.on(ctx)
  }

  return console.error('Bot can\'t found reserved reply.')
}
