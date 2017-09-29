module.exports = function (ctx, scene, body, current = 0) {
  this.flow.scenes[scene].current = current
  this.flow.scenes[ctx.user_id] = {
    ...this.flow.scenes[scene],
    body
  }
}
