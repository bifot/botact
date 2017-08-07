module.exports = function(event, callback) {
  if (typeof event === 'object') {
    event.forEach((cmd) => {
      this.action[event] = callback
    })
  } else {
    this.action[event] = callback
  }
}
