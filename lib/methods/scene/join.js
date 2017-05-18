module.exports = (self) => {
  return (ctx, session) => {
    return new Promise((resolve, reject) => {
      const current = Object.keys(self.scenes).indexOf(session)
      const key = Object.keys(self.scenes)[current]

      if (current > -1) {
        self.scenes[ctx.user_id] = self.scenes[key]
        resolve(self.scenes[ctx.user_id])
      } else {
        reject('Failed to join the scene')
      }
    })
  }
}
