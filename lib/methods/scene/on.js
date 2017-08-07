module.exports = function (ctx, session) {
  const currentSceneIndex = Object.keys(this.sessions).indexOf(session)

  if (currentSceneIndex > -1) {
    return this.sessions[currentSceneIndex][0](ctx)
  }
}
