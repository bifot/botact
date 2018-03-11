const { expect } = require('chai')
const { bot } = require('./test.config.js')

describe('api', () => {
  it('call api', async () => {
    const body = await bot.api('users.get', { user_ids: 1 })

    expect(body).to.deep.equal({
      response: [{
        id: 1,
        first_name: 'Павел',
        last_name: 'Дуров'
      }]
    })
  })

  it('call execute', () => {
    bot.execute('users.get', {
      user_ids: 1
    }, (body) => {
      expect(body).to.deep.equal({
        response: [{
          id: 1,
          first_name: 'Павел',
          last_name: 'Дуров'
        }]
      })
    })
  })
})