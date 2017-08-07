module.exports = function (ctx, session, current = 0) {
  const currentSceneIndex = Object.keys(this.scenes).indexOf(session)
  const currentSceneKey = Object.keys(this.scenes)[currentSceneIndex]

  if (currentSceneIndex > -1) {
    this.scenes[currentSceneKey].current = current
    this.scenes[ctx.user_id] = this.scenes[currentSceneKey]
  }
}
