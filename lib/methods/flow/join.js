module.exports = async function (ctx, scene, body, step = 0, now = true) {
  const { user_id, flow, redis } = ctx
  const { timeout } = flow
  const { [scene]: callbacks } = flow.scenes
  const callback = callbacks[step]
  
  try {
    const settings = {
      scene,
      step,
      session: body
    }
    
    timeout
      ? await redis.set(`flow:${user_id}`, JSON.stringify(settings), 'EX', timeout)
      : await redis.set(`flow:${user_id}`, JSON.stringify(settings))
    
    if (now) {
      return callback({
        ...ctx,
        session: body
      })
    }
  } catch (err) {
    return console.error(err)
  }
}
