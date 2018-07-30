module.exports = function(ctx, value, message) {
  if (!value) {
    this.throw(ctx, message)
  }
}
