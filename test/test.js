const { expect } = require('chai')
const { Botact } = require('../')
const config = require('../config')

const bot = new Botact(config)

describe('QIWI', () => {
  it('CREATE bot', () => {
    const bot = new Botact(config)

    expect(bot).to.be.a('object')
  })

  it('GET options', () => {
    const options = bot.options

    expect(bot.options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation' ])
  })

  it('SET options', () => {
    bot.options = { foo: 'bar' }

    const options = bot.options

    expect(options)
      .to.be.a('object')
      .to.have.all.keys([ 'token', 'confirmation', 'foo' ])
  })

  it('DELETE options', () => {
    bot.deleteOptions([ 'confirmation', 'foo' ])

    const options = bot.options

    expect(options)
      .to.be.a('object')
      .to.have.all.keys([ 'token' ])
  })
})
