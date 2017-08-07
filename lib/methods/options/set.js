module.exports = function (settings) {
  Object.entries(settings).forEach((item) => {
    this.settings[item[0]] = item[1]
  })
}
