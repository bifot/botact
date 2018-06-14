const { expect } = require('chai')
const path = require('path')
const { bot } = require('./test.config.js')

describe('methods', () => {
  describe('uploadCover', () => {
    it('uploadCover', async () => {
      const response = await bot.uploadCover(path.join(__dirname, './files/cover.png'), {
        crop_x2: 1590,
        crop_y2: 400
      })

      const { images } = response

      expect(response).to.be.a('object').to.have.all.keys([ 'images' ])
      expect(images).to.be.a('array')
    })
  })

  describe('reply', () => {
    it('reply without permission', async () => {
      const body = await bot.reply(1, 'Hello, world!')

      expect(body).to.deep.equal({
        response: [{
          peer_id: 1,
          error: {
            code: 901,
            description: 'Can\'t send messages for users without permission'
          }
        }]
      })
    })

    it('reply with permission', async () => {
      const { response } = await bot.reply(145003487, 'Hello, world!')
      const [ message ] = response

      expect(response).to.be.a('array')
      expect(message).to.be.a('object').to.have.all.keys([ 'peer_id', 'message_id' ])
    })

    it('reply with keyboard', async () => {
      const { response, error } = await bot.reply(145003487, 'This is button', null, {
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

    it('reply without message or attachment', async () => {
      try {
        await bot.reply(1, null)
      } catch (error) {
        expect(error).to.deep.equal({
          error: {
            error_code: 100,
            error_msg: 'One of the parameters specified was missing or invalid: message is empty or invalid',
            method: 'messages.send'
          }
        })
      }
    })
  })
})
