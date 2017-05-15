const api = require('../modules/api')

module.exports = (self) => {
  return () => {
    setInterval(() => {
      const method = self.msg.map(obj => `API.messages.send(${JSON.stringify(obj)})`)

      if (method.length !== 0) {
        api('execute', {
          code: `return [ ${method.join(',')} ];`,
          access_token: self.settings.token
        }).then(console.log).catch(console.log)

        self.msg = []
      }
    }, 350)
  }
}
