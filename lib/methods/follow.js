const api = require('../modules/api')

module.exports = (self) => {
  return () => {
    return new Promise((resolve, reject) => {
      const method = self.members.map(ctx => `API.groups.isMember(${JSON.stringify({
        group_id: self.settings.group_id,
        user_id: ctx.user_id
      })})`)

      if (method.length !== 0) {
        api('execute', {
          code: `return [ ${method.join(',')} ];`,
          access_token: self.settings.token
        }).then(body => {
          if (body.response) {
            const users = body.response.map((bool, i) => {
              return {
                ctx: self.members[i],
                member: bool
              }
            })

            self.members = []

            resolve({
              followers: users.filter(user => user.member).map(user => user.ctx),
              viewers: users.filter(user => !user.member).map(user => user.ctx)
            })
          }
        }).catch(reject)
      }
    })
  }
}
