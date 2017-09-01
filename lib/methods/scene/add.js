module.exports = function (scene, callbacks) {
  this.flow.scenes[scene] = callbacks
  this.flow.scenes[scene].current = 0
}
