module.exports = (self) => {
  return (callback) => {
    self.messages.on = callback
  }
}
