module.exports = function (userId, message, attachment) {
  return this.execute('messages.send', {
    user_id: userId,
    message: message,
    attachment: attachment
  }, this.settings.token, null)
}
