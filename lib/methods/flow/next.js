module.exports = async function({ user_id, peer_id, redis, flow }, session = {}) {
  const { token } = this.settings
  const { timeout } = flow

  try {
    const { scene, step, session: sessionInital } = await redis.get(`flow_${token}_${user_id || peer_id}`)

    const settings = {
      scene,
      step: step + 1,
      session: {
        ...sessionInital,
        ...session,
      },
    }

    if (timeout) {
      await redis.set(`flow_${token}_${user_id || peer_id}`, JSON.stringify(settings), 'EX', timeout)
    } else {
      await redis.set(`flow_${token}_${user_id || peer_id}`, JSON.stringify(settings))
    }

    return this
  } catch (err) {
    this.catch(err)
  }
}
