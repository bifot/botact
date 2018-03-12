module.exports = async function ({ user_id, redis, flow }, session = {}) {
  const { token } = this.settings
  const { timeout } = flow

  try {
    const { scene, step, session: sessionInital } = JSON.parse(await redis.getAsync(`flow:${token}:${user_id}`))

    const settings = {
      scene,
      step: step + 1,
      session: {
        ...sessionInital,
        ...session
      }
    }

    timeout
      ? await redis.set(`flow:${token}:${user_id}`, JSON.stringify(settings), 'EX', timeout)
      : await redis.set(`flow:${token}:${user_id}`, JSON.stringify(settings))

    return this
  } catch (err) {
    throw new Error(JSON.stringify(err))
  }
}
