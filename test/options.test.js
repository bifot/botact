const chai = require('chai')
const chaiJsonSchema = require('chai-json-schema')
const { bot } = require('./test.config.js')

chai.use(chaiJsonSchema)

const { expect } = chai

describe('options', () => {
  it('get options', () => {
    expect(bot.options).to.be.jsonSchema({
      type: 'object',
      required: [
        'token',
        'confirmation',
        'framework'
      ],
      properties: {
        token: {
          type: 'string'
        },
        confirmation: {
          type: 'string'
        },
        framework: {
          type: 'string'
        }
      }
    })
  })

  it('set options', () => {
    bot.options = { foo: 'bar' }

    expect(bot.options.foo).to.equal('bar')
  })

  it('delete options', () => {
    bot.deleteOptions([ 'confirmation', 'foo' ])

    expect(bot.options.confirmation).to.equal(undefined)
    expect(bot.options.foo).to.equal(undefined)
  })
})
