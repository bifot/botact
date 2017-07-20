const getLastMessage = require('../modules/getlastmessage')

module.exports = (self) => {
  return (req, res) => {
    return new Promise((resolve) => {
      if (self.options.secret && req.body.secret !== self.options.secret) {
        res.status(500).json({
          error: {
            error_code: 500,
            error_msg: 'Access denied.'
          }
        })

        return resolve(req.body.object)
      }

      const ctx = req.body.object

      if (ctx && ctx.user_id) {
        ctx.forward = getLastMessage(ctx)
        ctx.body = ctx.forward.body
        ctx.scene = {
          join: (scene, step) => self.joinScene(ctx, scene, step),
          next: () => self.nextStepScene(ctx),
          leave: () => self.leaveScene(ctx)
        }

        ctx.reply = (text, attachment) => self.reply(ctx.user_id, text, attachment)
        ctx.sendMessage = (userId, text, attachment) => self.reply(userId, text, attachment)
      }

      switch (req.body.type) {
        case 'confirmation':
          res.end(self.settings.confirmation)
          break

        case 'message_new':
          if (self.settings.sub) {
            self.execute('groups.isMember', {
              group_id: self.settings.group_id,
              user_id: ctx.user_id
            }, self.options.token, (data) => {
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

          if (typeof callback === 'function') {
            callback(ctx)
          }
      }

      res.end('ok')

      return resolve(req.body.object)
    })
  }
}
