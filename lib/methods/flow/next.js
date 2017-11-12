module.exports = async function ({ user_id, redis, flow }, body) {
  const { token } = this.settings
  const { timeout } = flow

  try {
    const { scene, step, body: session } = await (() => {
      return new Promise((resolve, reject) => {
        return redis.get(`flow:${token}:${user_id}`, (err, reply) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(reply))
          }
        })
      })
    })()

    const settings = {
      scene,
      step: step + 1,
      session: {
        ...session,
        ...body
      }
    }

    return timeout
      ? await redis.set(`flow:${token}:${user_id}`, JSON.stringify(settings), 'EX', timeout)
      : await redis.set(`flow:${token}:${user_id}`, JSON.stringify(settings))
  } catch (err) {
    return console.error(err)
  }
}
