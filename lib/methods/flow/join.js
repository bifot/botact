module.exports = function (ctx, scene, body, now, step = 0) {
  this.flow.scenes[scene].current = step
  this.flow.scenes[ctx.user_id] = {
    ...this.flow.scenes[scene],
    body
  }

  if (now) {
    const session = this.flow.scenes[ctx.user_id]

    return session.callback[session.current]({
      ...ctx,
      session: this.flow.scenes[ctx.user_id].body
    })
  }
}
