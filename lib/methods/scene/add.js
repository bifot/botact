module.exports = function (scene, callbacks) {
  this.scenes[scene] = callbacks
  this.scenes[scene].current = 0
}
