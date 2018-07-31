const Botact = require('../lib')

class Test extends Botact {
  constructor(settings) {
    super(settings)
  }

  call(update, type = 'message_new') {
    this.listen({
      request: {
        body: {
          type,
          object: update
        }
      },
      body: null,
      status: null
    })
  }
}

module.exports = new Test({
  token: process.env.TOKEN || 'token',
  confirmation: process.env.CONFIRMATION || 'confirmation',
  framework: process.env.FRAMEWORK || 'koa'
})
