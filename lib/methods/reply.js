module.exports = function (userId, message, attachment) {
  return this.execute('messages.send', {
    [ typeof userId === 'string' ? 'user_id' : 'user_ids' ]: typeof userId === 'string' ? userId : userId.join(','),
    message: message,
    attachment: attachment
  }, this.settings.token, null)
}
