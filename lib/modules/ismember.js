const api = require('./api')

module.exports = (group_id, user_id) => {
  return new Promise((resolve, reject) => {
    api('groups.isMember', {
      group_id: group_id,
      user_id: user_id,
      v: 5.62
    }).then(body => {
      if (body.response) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).catch(reject)
  })
}
