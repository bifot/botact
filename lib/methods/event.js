module.exports = function (event, callback) {
  const events = typeof event === 'object' ? event : [ event ]

  events.forEach((event) => {
    this.actions.events.push({
      event,
      callback
    })
  })

  return this
}
