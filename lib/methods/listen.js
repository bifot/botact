const getLastMessage = require('../modules/getlastmessage')

module.exports = (self) => {
  return (req, res) => {
    const data = req.body.object

    switch (req.body.type) {
      case 'confirmation':
        res.end(self.settings.confirmation)
        break

      case 'message_new':
        data.body = getLastMessage(data).body

        if (self.settings.sub !== undefined) {
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

    res.end('ok')
  }
}
