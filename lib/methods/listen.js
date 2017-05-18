const getLastMessage = require('../modules/getlastmessage')

module.exports = (self) => {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      const ctx = req.body.object

      switch (req.body.type) {
        case 'confirmation':
          res.end(self.settings.confirmation)
          break

        case 'message_new':
          ctx.body = getLastMessage(ctx).body

          if (self.settings.sub) {
            self.members.push(ctx)
          } else {
            self.handler(ctx)
          }

          break

        default:
          if (typeof self.action[req.body.type] === 'function') {
            return self.action[req.body.type](ctx)
          }
      }

      setInterval(() => {
        self.method.follow().then(ctx => {
          if (ctx.followers.length) {
            ctx.followers.forEach(ctx => self.handler(ctx))
          }

          if (ctx.viewers.length) {
            ctx.viewers.forEach(ctx => self.reply(ctx.user_id, self.settings.sub))
          }
        })

        self.method.execute().then(body => {
          console.log(JSON.stringify(body, null, 2))
        }).catch(console.log)
      }, 350)

      resolve(req.body)
      res.end('ok')
    })
  }
}
