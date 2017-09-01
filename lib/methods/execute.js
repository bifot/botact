module.exports = function (method, settings, key, callback) {
  const code = `API.${method}(${JSON.stringify(settings)})`

  if (!this.methods[key]) {
    this.methods[key] = {}
  }

  this.methods[key][code] = callback
}
