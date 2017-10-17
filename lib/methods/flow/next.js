module.exports = function (ctx, body) {
  if (this.flow.scenes[ctx.user_id]) {
    this.flow.scenes[ctx.user_id].current += 1
    
    if (body) {
      this.flow.scenes[ctx.user_id].body = body
    }
  }
}
