module.exports = (self) => {
  return (data) => {
    const command = data.body.toLowerCase()

    if (self.messages.commands[command] !== undefined) {
      return self.messages.commands[command](data)
    }

    const method = {}

    Object.keys(self.messages.hears).forEach(command => {
      method[command] = self.messages.hears[command]
    })

    if (Object.keys(method).length === 0) {
      if (typeof self.messages.on === 'function') {
        return self.messages.on(data)
      }

      return console.log('Bot can\'t found reserved reply.')
    }

    const regexp = Object.keys(method).filter(regexp => {
      return new RegExp(regexp, 'i').test(command)
    })

    if (regexp.length !== 0) {
      return method[regexp[0]](data)
    }

    if (typeof self.messages.on === 'function') {
      return self.messages.on(data)
    }

    return console.log('Bot can\'t found reserved reply.')
  }
}
