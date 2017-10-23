const redis = require('redis')
const client = redis.createClient()

module.exports = async function (ctx) {
  try {
    const { user_id, body, scene } = ctx
    const { commands, hears, on: reservedCallback } = this.actions
    
    const flow = await (() => {
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
    
    if (flow) {
      const { scene, step, body: session } = flow
      const { [scene]: callbacks } = this.flow.scenes
      const callback = callbacks[step]
      
      return callback({
        ...flow,
        ...ctx,
        session
      })
    }
    
    const message = body.toLowerCase()
    const commandKey = Object.keys(commands).filter(item => item.search(message) > -1)[0]
    const commandCallback = commands[commandKey]
    const hearsKey = Object.keys(hears).filter((item) => {
      const index = item.split(';').filter(item => new RegExp(item, 'i').test(message))
      return index.length
    })[0]
    const hearsCallback = hears[hearsKey]
    
    if (commandCallback !== undefined) {
      return commandCallback(ctx)
    } else if (hearsCallback !== undefined) {
      return hearsCallback(ctx)
    } else if (reservedCallback !== undefined) {
      return reservedCallback(ctx)
    }
    
    return false
  } catch (err) {
    return  console.error(err)
  }
}
