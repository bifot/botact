module.exports = function (command, callback) {
  const commands = typeof command === 'object' ? command : [ command ]

  commands.forEach((command) => {
    this.actions.commands[String(command).toLowerCase()] = callback
  })
}
