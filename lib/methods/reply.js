module.exports = function (user_id, message, attachment, callback) {
  const { token: access_token } = this.settings

  return this.execute('messages.send', {
    user_ids: typeof user_id === 'number' ? user_id : user_id.join(','),
    message,
    attachment,
    access_token
  }, callback)
}
