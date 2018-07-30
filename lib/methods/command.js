module.exports = function(...args) {
  const command = args[0]
  const isPriority = typeof args[1] === 'boolean' ? args[1] : false
  const callback = args.length === 2 ? args[1] : args[2]

  const commands = Array.isArray(command) ? command : [command]

  commands.forEach((command) => {
    this.actions.commands.push({
      command,
      callback,
      isPriority
    })
  })

  return this
}
