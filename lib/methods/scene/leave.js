module.exports = function (ctx) {
  delete this.scenes[ctx.user_id]
}
