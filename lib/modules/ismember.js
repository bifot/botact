const api = require('./api')

module.exports = (groupId, uid) => {
  return new Promise((resolve, reject) => {
    api('groups.isMember', {
      group_id: groupId,
      user_id: uid,
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
