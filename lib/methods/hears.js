module.exports = function (command, callback) {
  const { hears } = this.actions
  const list = typeof command === 'object' && !/\/[\S]{1,}\/[a-z]{1,2}/.test(command)
    ? command : [command]
  const string = list
    .map(item => (/\/[\S]{1,}\/[a-z]{1,2}/.test(item) ? item : item.toString()).toLowerCase()).join(';')

  hears[string] = callback

  return this
}
