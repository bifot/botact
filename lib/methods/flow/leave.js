module.exports = async function leaveScene({ redis, user_id }) {
  try {
    const { token } = this.settings

    await redis.del(`flow_${token}_${user_id}`)

    return this
  } catch (err) {
    throw new Error(JSON.stringify(err))
  }
}
