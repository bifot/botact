const { expect } = require('chai')
const { bot } = require('./test.config.js')

describe('api', () => {
  it('single call', async () => {
    const body = await bot.api('users.get', { user_ids: 1 })

    expect(body).to.deep.equal({
      response: [{
        id: 1,
        first_name: 'Павел',
        last_name: 'Дуров'
      }]
    })
  })

  it('execute (callback)', () => {
    bot.execute('users.get', {
      user_ids: 1
    }, (body) => {
      expect(body).to.deep.equal({
        response: [
          {
            id: 1,
            first_name: 'Павел',
            last_name: 'Дуров'
          }
        ]
      })
    })

    bot.execute('groups.isMember', {
      group_id: process.env.GROUP_ID,
      user_id: 1
    }, (body) => {
      expect(body).to.deep.equal({
        response: 0
      })
    })
  })

  it('execute (promisify)', async () => {
    const results = await Promise.all([
      bot.execute('users.get', {
        user_ids: 1
      }),
      bot.execute('groups.isMember', {
        group_id: process.env.GROUP_ID,
        user_id: 1
      })
    ])

    expect(results).to.deep.equal([
      [
        {
          id: 1,
          first_name: 'Павел',
          last_name: 'Дуров'
        }
      ],
      0
    ])
  })
})
