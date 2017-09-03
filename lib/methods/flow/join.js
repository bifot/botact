module.exports = function (ctx, session, current = 0) {
  const currentSceneIndex = Object.keys(this.flow.scenes).indexOf(session)
  const currentSceneKey = Object.keys(this.flow.scenes)[currentSceneIndex]

  if (currentSceneIndex > -1) {
    this.flow.scenes[currentSceneKey].current = current
    this.flow.scenes[ctx.user_id] = this.flow.scenes[currentSceneKey]
  }
}
