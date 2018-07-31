const getLastMessage = (message) => {
  if (message.fwd_messages && message.fwd_messages.length) {
    return getLastMessage(message.fwd_messages[0])
  }

  return message
}

module.exports = getLastMessage
