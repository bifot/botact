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

      setInterval(() => {
        self.method.execute().then(body => {
          console.log(JSON.stringify(body, null, 2))
        })

        self.method.follow().then(data => {
          if (data.followers) {
            data.followers.forEach(ctx => self.handler(ctx.data))
          }

          if (data.users) {
            data.users.forEach(ctx => self.reply(ctx.data.user_id, self.settings.sub))
          }
        })
      }, 350)

      resolve(req.body)
      res.end('ok')
    })
  }
}
