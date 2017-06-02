const api = require('../modules/api')

module.exports = (self) => {
  return () => {
    return new Promise((resolve, reject) => {
      const users = self.followers
      const method = users.map(ctx => `API.groups.isMember(${JSON.stringify({
        group_id: self.settings.group_id,
        user_id: ctx.user_id
      })})`)

      self.followers = []

      if (method.length) {
        api('execute', {
          code: `return [ ${method.join(',')} ];`,
          access_token: self.settings.token
        }).then(body => {
          const response = body.response.map((follower, i) => {
            return {
              user_id: users[i].user_id,
              ctx: users[i],
              follower: follower
            }
          })

          resolve({
            members: response.filter(item => item.follower),
            viewers: response.filter(item => !item.follower)
          })
        }).catch(reject)
      }
    })
  }
}
