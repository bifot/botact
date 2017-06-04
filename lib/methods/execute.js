module.exports = (self) => {
  return (method, settings, type, callback) => {
    const code = `API.${method}(${JSON.stringify(settings)})`
    self.requests[type][code] = callback
  }
}
