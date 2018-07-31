const { expect } = require('chai')
const sinon = require('sinon')
const bot = require('./test.config.js')

describe('botact core', () => {
  it('get options', () => {
    expect(bot.options).to.be.a('object')
  })

  it('set options', () => {
    bot.options.name = 'Super bot'

    expect(bot.options.name).to.equal('Super bot')
  })

  it('add command', () => {
    const callback = sinon.fake()

    bot.command('start', callback)
    bot.call({ text: 'start' })

    expect(bot.actions.commands).to.have.length(1)
    expect(callback.calledOnce).to.equal(true)
  })

  it('add hears', () => {
    const callback = sinon.fake()

    bot.hears('tesla', callback)
    bot.call({ text: 'I am using a Tesla!' })

    expect(bot.actions.hears).to.have.length(1)
    expect(callback.calledOnce).to.equal(true)
  })

  it('add on', () => {
    const callback = sinon.fake()

    bot.on(callback)
    bot.call({ text: 'Hello, world!' })

    expect(bot.actions.on).to.have.length(1)
    expect(callback.calledOnce).to.equal(true)
  })

  it('add event', () => {
    const callback = sinon.fake()

    bot.event('group_join', callback)
    bot.call({}, 'group_join')

    expect(bot.actions.events).to.have.length(1)
    expect(callback.calledOnce).to.equal(true)
  })

  it('add catch & call throw', () => {
    const callback = sinon.fake()

    bot.catch(callback)
    bot.throw(null)

    expect(callback.calledOnce).to.equal(true)
  })
})
