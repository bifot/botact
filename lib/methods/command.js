module.exports = (self) => {
  return (command, callback) => {
    if (typeof command === 'object') {
      command.forEach((cmd) => {
        self.messages.commands[String(cmd).toLowerCase()] = callback
      })
    } else {
      self.messages.commands[String(command).toLowerCase()] = callback
    }
  }
}
