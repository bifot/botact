const redis = require('redis')
const client = redis.createClient()

module.exports = async ({ user_id }, body) => {
  try {
    const { scene, step, body: session } = await (() => {
      return new Promise((resolve, reject) => {
        return client.get(`flow:${user_id}`, (err, reply) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(reply))
          }
        })
      })
    })()
    
    return await client.set(`flow:${user_id}`, JSON.stringify({
      scene,
      step: step + 1,
      session: {
        ...session,
        ...body
      }
    }))
  } catch (err) {
    return console.error(err)
  }
}
