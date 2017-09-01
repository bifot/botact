module.exports = function (ctx, session) {
  const currentSceneIndex = Object.keys(this.flow.sessions).indexOf(session)

  if (currentSceneIndex > -1) {
    return this.flow.sessions[currentSceneIndex][0](ctx)
  }
}
