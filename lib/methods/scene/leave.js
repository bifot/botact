module.exports = (self) => {
  return ({ user_id }) => {
    delete self.scenes[user_id]
  }
}
