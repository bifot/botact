module.exports = function(ctx) {
  if (this.flow.scenes[ctx.user_id]) {
    this.flow.scenes[ctx.user_id].current += 1
  }
}
