module.exports = function(handler) {
  this.catch = handler

  return this
}
