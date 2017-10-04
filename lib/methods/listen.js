const getLastMessage = require('../modules/getlastmessage')

module.exports = function (req, res) {
  return new Promise((resolve) => {
    if (this.settings.secret && req.body.secret !== this.settings.secret) {
      if (req.body.type === 'confirmation') {
        res.send(this.settings.confirmation)
      } else {
        res.status(500).json({
          error: {
            error_code: 500,
            error_msg: 'Access denied.'
          }
        })
      }

      resolve(req.body.object)
    }

    const ctx = {
      ...req.body.object,
      ...this,
      group_id: req.body.group_id
    }

    if (ctx && ctx.user_id) {
      ctx.forward = getLastMessage(ctx)
      ctx.body = ctx.forward.body
      ctx.scene = {
        join: (scene, body, now, step) => this.joinScene(ctx, scene, body, now, step),
        next: (body) => this.nextScene(ctx, body),
        leave: () => this.leaveScene(ctx)
      }

      ctx.reply = (text, attachment) => this.reply(ctx.user_id, text, attachment)
      ctx.sendMessage = (userId, text, attachment) => this.reply(userId, text, attachment)

      if (this.settings.access && this.settings.access.indexOf(ctx.user_id) === -1) {
        res.end('ok')

        resolve(req.body.object)
      }
    }

    switch (req.body.type) {
      case 'confirmation':
        res.send(this.settings.confirmation)
        break

      case 'message_new':
        if (this.settings.sub) {
          this.execute('groups.isMember', {
            group_id: this.settings.group_id,
            user_id: ctx.user_id
          }, this.settings.token, (data) => {
            if (data) {
              this.handler(ctx).catch(console.error)
            } else {
              this.reply(ctx.user_id, this.settings.sub)
            }
          })
        } else {
          this.handler(ctx)
        }

        break

      default:
        const callback = this.actions.events[req.body.type]

        if (typeof callback === 'function') {
          callback(ctx)
        }
    }

    res.end('ok')

    resolve(req.body.object)
  })
}
