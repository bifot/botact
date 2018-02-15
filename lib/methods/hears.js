module.exports = function (command, callback) {
  const commands = typeof command === 'object' && !(command instanceof RegExp)
    ? command : [ command ]

  commands
    .map(command => command instanceof RegExp ? command : new RegExp(command, 'i'))
    .forEach((command) => {
      this.actions.hears.push({
        command,
        callback
      })
    })

  return this
}
