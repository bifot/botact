// TODO: Refactor
module.exports = function(ctx, index) {
  if (this.actions.middlewares.length > index + 1) {
    return this.actions.middlewares[index + 1](ctx)
  }

  if (ctx.type === 'message_new') {
    return this.handler(ctx)
  }

  const event = this.actions.events.find(item => item.event === ctx.type)

  if (event) {
    event.callback(ctx)
  }
}
