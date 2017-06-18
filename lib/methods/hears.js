module.exports = (self) => {
  return (command, callback) => {
    if (typeof command === 'object') {
      command.forEach((cmd) => {
        self.messages.hears[String(cmd).toLowerCase()] = callback
      })
    } else {
      self.messages.hears[String(command).toLowerCase()] = callback
    }
  }
}
