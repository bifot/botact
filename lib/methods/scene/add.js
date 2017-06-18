module.exports = (self) => {
  return (scene, callbacks) => {
    self.scenes[scene] = callbacks
    self.scenes[scene].current = 0
  }
}
