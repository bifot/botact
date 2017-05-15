const getLastMessage = require('../modules/getlastmessage')

module.exports = (self) => {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      const data = req.body.object

      switch (req.body.type) {
        case 'confirmation':
          res.end(self.settings.confirmation)
          break

        case 'message_new':
          data.body = getLastMessage(data).body

          if (self.settings.sub) {
            self.members.push(data)
          } else {
            self.handler(data)
          }

          break

        default:
          if (typeof self.action[req.body.type] === 'function') {
            return self.action[req.body.type](data)
          }
      }

      resolve(req.body)
      res.end('ok')
    })
  }
}
