module.exports = (self) => {
  return (user_id, message, attachments) => {
    self.msg.push({
      user_id: user_id,
      message: message,
      attachment: attachments
    })
  }
}
