const { expect } = require('chai')
const { bot } = require('./test.config.js')

module.exports = () => {
  it('get options', () => {
    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'group_id' ])
  })

  it('set options', () => {
    bot.options = { foo: 'bar' }

    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'group_id', 'foo' ])
  })

  it('delete options', () => {
    bot.deleteOptions([ 'confirmation', 'foo' ])

    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'group_id' ])
  })
}