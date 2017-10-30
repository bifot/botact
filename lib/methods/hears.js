module.exports = function (command, callback) {
  const { hears } = this.actions
  const list = typeof command === 'object' ? command : [command]
  const string = list.map(item => item.toString().toLowerCase()).join(';')

  hears[string] = callback

  return this
}
