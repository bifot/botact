module.exports = function(event, callback) {
  const events = Array.isArray(event) ? event : [event]

  events.forEach((event) => {
    this.actions.events.push({
      event,
      callback,
    })
  })

  return this
}
