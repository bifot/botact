module.exports = async function addBefore(callback) {
  try {
    this.inital = await callback()
  } catch (err) {
    throw new Error(JSON.stringify(err))
  }

  return this
}
