module.exports = function (userId, message, attachment, callback) {
  const { token: access_token } = this.settings

  return this.execute('messages.send', {
    user_ids: typeof userId === 'number' ? userId : userId.join(','),
    message,
    attachment,
    access_token
  }, callback)
}
