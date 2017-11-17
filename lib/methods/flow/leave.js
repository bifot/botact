module.exports = async function ({ redis, user_id }) {
  try {
    const { token } = this.settings

    return await redis.del(`flow:${token}:${user_id}`)
  } catch (err) {
    return console.error(err)
  }
}
