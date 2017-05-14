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
          if (body.response !== undefined) {
            const users = body.response.map((bool, i) => {
              return {
                data: self.members[i],
                member: bool
              }
            })

            users.filter(user => user.member).forEach(user => {
              self.handler(user.data)
            })

            users.filter(user => !user.member).forEach(user => {
              self.reply(user.data.user_id, self.settings.sub)
            })
          }

          self.members = []
        })
      }
    }, 350)
  }
}
