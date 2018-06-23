const api = require('../api')
const callbackHandler = require('./callbackHandler')

module.exports = (methods) => {
  methods.forEach(({ access_token, items }) => {
    for (let i = 0, j = Math.ceil(items.length / 25); i < j; i++) {
      const executionItems = items.slice(i * 25, i * 25 + 25)
      const codes = executionItems.map(({ code }) => code)

      api('execute', {
        code: `return [ ${codes.join(',')} ];`,
        access_token,
      })
        .then(body => callbackHandler(body, executionItems))
        .catch(err => callbackHandler(err, executionItems))
    }
  })
}
