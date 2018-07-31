module.exports = function(handler) {
  const id = this.actions.middlewares.length

  this.actions.middlewares.push(
    (ctx) => handler(ctx, () => this.next(ctx, id))
  )

  return this
}
