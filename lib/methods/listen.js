const getLastMessage = require('../modules/getlastmessage')
const isMember = require('../modules/ismember')

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

          isMember(self.settings.group_id, ctx.user_id)
            .then(() => self.handler(ctx))
            .catch(() => self.reply(ctx.user_id, self.settings.sub))

          break

        default:
          if (typeof self.action[req.body.type] === 'function') {
            return self.action[req.body.type](ctx)
          }
      }

      setInterval(() => {
        self.method.execute().then(body => {
          console.log(JSON.stringify(body, null, 2))
        }).catch(console.log)
      }, 350)

      resolve(req.body)
      res.end('ok')
    })
  }
}
