module.exports = function (command, callback) {
  const { commands } = this.actions
  const list = typeof command === 'object' ? command : [ command ]
  const string = list.map(item => item.toString().toLowerCase()).join(';')

  commands[string] = callback

  return this
}
