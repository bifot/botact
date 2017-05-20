module.exports = (self) => {
  return (ctx) => {
    return new Promise((resolve, reject) => {
      if (self.scenes[ctx.user_id]) {
        delete self.scenes[ctx.user_id]
        resolve('Scene deleted')
      } else {
        reject('Failed to find the scene')
      }
    })
  }
}
