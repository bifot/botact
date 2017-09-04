const { Botact } = require('../index')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN
})

bot.setOptions({
  foo: 'bar',
  zed: 'quux',
  bar: 'beez'
})

bot.deleteOptions([
  'bar',
  'zed'
])

console.log(bot.getOptions())
// {
//   confirmation: 'CONFIRMATION',
//   token: 'TOKEN',
//   foo: 'bar'
// }
