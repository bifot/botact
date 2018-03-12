module.exports = async function ({ redis, user_id }) {
  try {
    const { token } = this.settings

    await redis.del(`flow:${token}:${user_id}`)

    return this
  } catch (err) {
    throw new Error(JSON.stringify(err))
  }
}
