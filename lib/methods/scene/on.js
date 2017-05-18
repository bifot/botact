module.exports = (self) => {
  return (ctx, session) => {
    const current = Object.keys(self.sessions).indexOf(session)

    if (current > -1) {
      return self.sessions[current][0](ctx)
    }
  }
}
