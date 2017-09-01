module.exports = function(command, callback) {
  if (typeof command === 'object') {
    command.forEach((cmd) => {
      this.actions.commands[String(cmd).toLowerCase()] = callback
    })
  } else {
    this.actions.commands[String(command).toLowerCase()] = callback
  }
}
