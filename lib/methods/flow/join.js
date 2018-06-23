module.exports = async function joinScene(ctx, scene, session = {}, step = 0, instantly = true) {
  const { token } = this.settings
  const { user_id, flow, redis } = ctx
  const { timeout } = flow
  const { [scene]: callbacks } = flow.scenes
  const callback = callbacks[step]

  try {
    const settings = {
      scene,
      step,
      session,
    }

    if (timeout) {
      await redis.set(`flow_${token}_${user_id}`, JSON.stringify(settings), 'EX', timeout)
    } else {
      await redis.set(`flow_${token}_${user_id}`, JSON.stringify(settings))
    }

    if (instantly) {
      callback({
        ...ctx,
        session,
      })
    }

    return this
  } catch (err) {
    throw new Error(JSON.stringify(err))
  }
}
