module.exports = async function (callback) {
  try {
    this.inital = await callback()
  } catch (err) {
    console.error(err)
  }

  return this
}
