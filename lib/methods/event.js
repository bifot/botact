module.exports = function(event, callback) {
  if (typeof event === 'object') {
    event.forEach((cmd) => {
      this.actions.events[event] = callback
    })
  } else {
    this.actions.events[event] = callback
  }
}
