module.exports = function (command, callback) {
  if (typeof command === 'object') {
    command.forEach((cmd) => {
      this.actions.hears[String(cmd).toLowerCase()] = callback
    })
  } else {
    this.actions.hears[String(command).toLowerCase()] = callback
  }
}
