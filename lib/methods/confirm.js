module.exports = (self) => {
  return (res) => {
    return res.end(self.settings.confirmation)
  }
}
