module.exports = (self) => {
  return (ctx, session, current = 0) => {
    const currentSceneIndex = Object.keys(self.scenes).indexOf(session)
    const currentSceneKey = Object.keys(self.scenes)[currentSceneIndex]

    if (currentSceneIndex > -1) {
      self.scenes[currentSceneKey].current = current
      self.scenes[ctx.user_id] = self.scenes[currentSceneKey]
    }
  }
}
