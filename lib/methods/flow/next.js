module.exports = async ({ user_id }, body) => {
  const { timeout } = this.flow;
  try {
    const { scene, step, body: session } = await (() => {
      return new Promise((resolve, reject) => {
        return this.redis.get(`flow:${user_id}`, (err, reply) => {
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

    return timeout ?
      await this.redis.set(`flow:${user_id}`, JSON.stringify(settings), 'EX', timeout) :
      await this.redis.set(`flow:${user_id}`, JSON.stringify(settings))
  } catch (err) {
    return console.error(err)
  }
}
