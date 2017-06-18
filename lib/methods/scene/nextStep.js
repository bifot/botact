module.exports = (self) => {
  return ({ user_id }) => {
    if (self.scenes[user_id]) {
      self.scenes[user_id].current += 1
    }
  }
}
