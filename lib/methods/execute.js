module.exports = function (method, settings, key, callback) {
  const code = `API.${method}(${JSON.stringify(settings)})`

  if (!this.requests[key]) {
    this.requests[key] = {}
  }

  this.requests[key][code] = callback
}
