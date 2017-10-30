module.exports = function (event, callback) {
  const events = typeof event === 'object' ? event : [ event ]

  events.forEach((event) => {
    this.actions.events[event] = callback
  })

  return this
}
