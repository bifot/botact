module.exports = function addCommand(command, callback) {
  const commands = Array.isArray(command) ? command : [command]

  commands.forEach((command) => {
    this.actions.commands.push({
      command,
      callback,
    })
  })

  return this
}
