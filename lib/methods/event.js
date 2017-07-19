module.exports = (self) => {
  return (event, callback) => {
    if (typeof event === 'object') {
      event.forEach((cmd) => {
        self.action[event] = callback
      })
    } else {
      self.action[event] = callback
    }
  }
}
