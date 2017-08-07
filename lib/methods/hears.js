module.exports = function (command, callback) {
  if (typeof command === 'object') {
    command.forEach((cmd) => {
      this.messages.hears[String(cmd).toLowerCase()] = callback
    })
  } else {
    this.messages.hears[String(command).toLowerCase()] = callback
  }
}
