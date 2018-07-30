module.exports = async function({ redis, user_id, peer_id }) {
  try {
    const { token } = this.settings

    await redis.del(`flow_${token}_${user_id || peer_id}`)

    return this
  } catch (err) {
    this.catch(err)
  }
}
