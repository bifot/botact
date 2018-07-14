const { expect } = require('chai')
const { Botact, compose } = require('../')
const { bot } = require('./test.config.js')

describe('methods', () => {
  it('compose multiple bots', () => {
    const bot1 = new Botact({
      token: 'token',
      confirmation: 'confirmation'
    })
    const bot2 = new Botact({
      token: 'token',
      confirmation: 'confirmation'
    })

    bot1.addScene('withdrawal', () => {})
    bot1.command('/start', () => {})
    bot1.hears('money', () => {})

    bot2.addScene('game', () => {})
    bot2.command('/help', () => {})
    bot2.hears('hello', () => {})

    const bot = compose(bot1, bot2)

    expect(bot.actions.commands.map((item) => item.command))
      .to.deep.equal(['/start', '/help'])
    expect(bot.actions.hears.map((item) => item.command))
      .to.deep.equal([/money/i, /hello/i])
    expect(Object.keys(bot.flow.scenes))
      .to.deep.equal(['withdrawal', 'game'])
  })

  it('reply with keyboard', async () => {
    const { response } = await bot.reply(145003487, 'This is button', null, {
      one_time: false,
      buttons: [
        [
          {
            action: {
              type: 'text',
              payload: {
                button: 'Hello, world!'
              },
              label: 'Hello, world!'
            },
            color: 'primary'
          }
        ]
      ]
    })
    const [ message ] = response

    expect(response).to.be.a('array')
    expect(message).to.be.a('object').to.have.all.keys([ 'peer_id', 'message_id' ])
  })
})
