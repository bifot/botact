module.exports = function(ctx) {
  if (this.scenes[ctx.user_id]) {
    this.scenes[ctx.user_id].current += 1
  }
}
