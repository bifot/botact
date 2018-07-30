module.exports = async function(ctx, scene, session = {}, step = 0, instantly = true) {
  const { token } = this.settings
  const { user_id, peer_id, flow, redis } = ctx
  const { timeout } = flow
  const { [scene]: callbacks } = flow.scenes

  if (!callbacks || !callbacks.length) {
    return this.catch(`Flow: ${scene} scene has no callbacks`)
  }

  const callback = callbacks[step]

  try {
    const settings = {
      scene,
      step,
      session,
    }

    if (timeout) {
      await redis.set(`flow_${token}_${user_id || peer_id}`, JSON.stringify(settings), 'EX', timeout)
    } else {
      await redis.set(`flow_${token}_${user_id || peer_id}`, JSON.stringify(settings))
    }

    if (instantly) {
      callback({
        ...ctx,
        session,
      })
    }

    return this
  } catch (err) {
    this.catch(err)
  }
}
