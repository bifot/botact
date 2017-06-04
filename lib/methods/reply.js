module.exports = (self) => {
  return (user_id, message, attachments) => {
    self.execute('messages.send', {
      user_id: user_id,
      message: message,
      attachment: attachments
    }, 'group', null)
  }
}
