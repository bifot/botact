module.exports = (self) => {
  return (userId, message, attachments) => {
    return self.execute('messages.send', {
      user_id: userId,
      message: message,
      attachment: attachments
    }, 'group', null)
  }
}
