const api = require('./api')

module.exports = (groupId, userId) => {
  return new Promise((resolve, reject) => {
    api('groups.isMember', {
      group_id: groupId,
      user_id: userId,
      v: 5.62
    }).then(body => {
      if (body.response) {
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(reject)
  })
}
