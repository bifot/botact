module.exports = function(settings) {
  this.settings = {
    ...this.settings,
    ...settings,
  }
}
