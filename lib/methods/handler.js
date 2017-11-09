module.exports = async function (ctx) {
  try {
    const { user_id, body } = ctx
    const { redisGet } = this.utils
    const { commands, hears, on: reservedCallback } = this.actions

    const flow = JSON.parse(await redisGet(`flow:${user_id}`))

    if (flow) {
      const { scene, step, session } = flow
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
  } catch (err) {
    console.error(err)
  }
}
