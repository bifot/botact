const api = require('../modules/api')

module.exports = (self) => {
  return () => {
    setInterval(() => {
      const method = self.members.map(data => `API.groups.isMember(${JSON.stringify({
        group_id: self.settings.group_id,
        user_id: data.user_id
      })})`)

      if (method.length !== 0) {
        api('execute', {
          code: `return [ ${method.join(',')} ];`,
          access_token: self.settings.token
        }).then(body => {
          const users = body.response.map((bool, i) => {
            return {
              id: self.members[i].uid,
              member: bool
            }
          })

          users.filter(user => user.member).forEach((user, i) => self.handler(self.members[i]))
          users.filter(user => !user.member).forEach((user, i) => self.reply(user.id, self.settings.sub))

          self.members = []
        })
      }
    }, 350)
  }
}
