module.exports = function(scene, ...callbacks) {
  this.flow.scenes[scene] = callbacks.length === 1 && typeof callbacks[0] === 'object'
    ? callbacks[0] : callbacks

  return this
}
