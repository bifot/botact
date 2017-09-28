module.exports = function (method, settings, key, callback) {
  const code = `API.${method}(${JSON.stringify(settings)})`

  this.methods[key] = {
    ...this.methods[key],
    [code]: callback
  }
}
