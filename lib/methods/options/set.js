module.exports = function setOptions(settings) {
  this.settings = {
    ...this.settings,
    ...settings,
  }
}
