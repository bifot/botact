module.exports = (self) => {
  return (ctx, session) => {
    const currentSceneIndex = Object.keys(self.sessions).indexOf(session)

    if (currentSceneIndex > -1) {
      return self.sessions[currentSceneIndex][0](ctx)
    }
  }
}
