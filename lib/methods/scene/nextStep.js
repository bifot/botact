module.exports = (self) => {
  return (ctx) => {
    return new Promise((resolve, reject) => {
      if (self.scenes[ctx.user_id]) {
        self.scenes[ctx.user_id].current += 1
        resolve(`${self.scenes[ctx.user_id].current} step`)
      } else {
        reject('Failed to find the scene')
      }
    })
  }
}
