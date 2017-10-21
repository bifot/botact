const redis = require('redis')
const client = redis.createClient()

module.exports = async function (ctx, scene, body, step = 0) {
  const { user_id } = ctx
  const { [scene]: callbacks } = this.flow.scenes
  const callback = callbacks[step]
  
  try {
    const settings = {
      scene,
      step,
      body
    }
    
    await client.set(`flow:${user_id}`, JSON.stringify(settings))
    
    return callback({
      ...ctx,
      session: body
    })
  } catch (err) {
    return console.error(err)
  }
}
