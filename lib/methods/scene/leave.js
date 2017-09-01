module.exports = function (ctx) {
  delete this.flow.scenes[ctx.user_id]
}
