module.exports = function deleteOptions(keys) {
  keys.forEach((key) => {
    delete this.settings[key]
  })

  return this
}
