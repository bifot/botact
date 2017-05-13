module.exports = (self) => {
  return (event, callback) => {
    self.action[event] = callback
  }
}
