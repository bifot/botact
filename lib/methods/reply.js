module.exports = function (user_id, message, attachment) {
  return new Promise((resolve, reject) => {
    const { token: access_token } = this.settings

    this.execute('messages.send', {
      user_ids: typeof user_id === 'number' ? user_id : user_id.join(','),
      message,
      attachment,
      access_token
    }, ({ response, error }) => {
      if (error) {
        reject({ error })
      }

      resolve({ response })
    })
  })
}
