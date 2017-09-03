module.exports = function (scene, ...callbacks) {
  this.flow.scenes[scene] = {
    callback: callbacks,
    current: 0
  }
}
