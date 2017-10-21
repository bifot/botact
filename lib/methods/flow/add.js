module.exports = function (scene, ...callbacks) {
  this.flow.scenes[scene] = callbacks
}
