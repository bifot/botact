module.exports = function(type, callback) {
  this.actions.on.push({
    type: typeof type === 'function' ? 'message' : type,
    callback: typeof type === 'function' ? type : callback,
  })

  return this
}
