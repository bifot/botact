module.exports = function use(callback) {
  this.actions.middlewares.push(callback)

  return this
}
