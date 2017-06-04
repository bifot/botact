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
            self.execute('groups.isMember', {
              group_id: self.settings.group_id,
              user_id: ctx.user_id
            }, 'group', (data) => {
              if (data) {
                self.handler(ctx)
              } else {
                self.reply(ctx.user_id, self.settings.sub)
              }
            })
          } else {
            self.handler(ctx)
          }

          break

        default:
          const callback = self.action[req.body.type]
          if (typeof callback === 'function') callback(ctx)
      }

      res.end('ok')
      resolve(req.body)
    })
  }
}
