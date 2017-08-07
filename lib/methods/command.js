module.exports = function(command, callback) {
  if (typeof command === 'object') {
    command.forEach((cmd) => {
      this.messages.commands[String(cmd).toLowerCase()] = callback
    })
  } else {
    this.messages.commands[String(command).toLowerCase()] = callback
  }
}
