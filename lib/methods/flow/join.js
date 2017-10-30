module.exports = async function (ctx, scene, body, step = 0) {
  const { timeout } = this.flow;
  const { user_id } = ctx
  const { [scene]: callbacks } = this.flow.scenes
  const callback = callbacks[step]
  
  try {
    const settings = {
      scene,
      step,
      session: body
    }

    timeout ?
      await this.redis.set(`flow:${user_id}`, JSON.stringify(settings), 'EX', timeout) :
      await this.redis.set(`flow:${user_id}`, JSON.stringify(settings))

    
    return callback({
      ...ctx,
      session: body
    })
  } catch (err) {
    return console.error(err)
  }
}
