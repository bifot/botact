const api = require('../modules/api')

module.exports = (self) => {
  return () => {
    return new Promise((resolve, reject) => {
      const method = self.msg.map(obj => `API.messages.send(${JSON.stringify(obj)})`)

      if (method.length !== 0) {
        self.msg = []

        api('execute', {
          code: `return [ ${method.join(',')} ];`,
          access_token: self.settings.token
        }).then(body => {
          if (!body.response || body.error) {
            reject(body.error)
          } else {
            const sended = body.response.filter(status => status)

            resolve({
              sended: sended.length,
              body: body
            })
          }
        }).catch(reject)
      }
    })
  }
}
