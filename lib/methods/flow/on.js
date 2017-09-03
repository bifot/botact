module.exports = function (ctx) {
  const session = this.flow.scenes[ctx.user_id]

  return session.callback[session.current](ctx)
}
