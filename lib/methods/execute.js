module.exports = function (method, settings, token, callback = () => {}) {
  let code = `API.${method}(${JSON.stringify(settings)})`
  let [ packet ] = this.methods.filter(item => item.access_token === token)

  if (!packet) {
    this.methods.push({
      access_token: token,
      items: []
    })

    packet = this.methods.filter(item => item.access_token === token)[0]
  }

  const { items } = packet

  items.push({ code, callback })

  return this
}
