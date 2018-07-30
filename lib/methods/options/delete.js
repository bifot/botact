module.exports = function(keys) {
  keys.forEach((key) => {
    delete this.settings[key]
  })

  return this
}
