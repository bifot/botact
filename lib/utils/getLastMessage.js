module.exports = getLastMessage = (msg) => {
  if (msg.fwd_messages && msg.fwd_messages.length) {
    return getLastMessage(msg.fwd_messages[0])
  }

  return msg
}
