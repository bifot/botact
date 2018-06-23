module.exports = function addHears(command, callback) {
  const commands = Array.isArray(command) ? command : [command]

  commands
    .map(command => (command instanceof RegExp ? command : new RegExp(command, 'i')))
    .forEach((command) => {
      this.actions.hears.push({
        command,
        callback,
      })
    })

  return this
}
