module.exports = (self) => {
  return (userId, message, attachments) => {
    self.execute('messages.send', {
      user_id: userId,
      message: message,
      attachment: attachments
    }, 'group', null)
  }
}
