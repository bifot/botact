module.exports = (self) => {
  return (name, callbacks) => {
    return new Promise((resolve, reject) => {
      const methods = {}

      callbacks.forEach((callback, i) => methods[i] = callback)

      self.scenes[name] = methods
      self.scenes[name].current = 0

      resolve(self.scenes[name])
    })
  }
}
