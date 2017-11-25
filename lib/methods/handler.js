module.exports = async function (ctx) {
  try {
    const { token } = this.settings
    const { commands, hears, on: reservedCallback } = this.actions
    const { scenes } = this.flow
    const { user_id, body } = ctx
    const flow = JSON.parse(await this.redis.getAsync(`flow:${token}:${user_id}`))

    if (flow) {
      const { scene, step, session } = flow
      const { [scene]: callbacks } = scenes
      const callback = callbacks[step]

      return callback({
        ...flow,
        ...ctx,
        session
      })
    }

    const [ commandFiltered ] = commands.filter(({ command }) => command === body)
    const [ hearsFiltered ] = hears.filter(({ command }) => command.test(body))

    if (commandFiltered) {
      return commandFiltered.callback(ctx)
    } else if (hearsFiltered) {
      return hearsFiltered.callback(ctx)
    } else if (reservedCallback) {
      return reservedCallback(ctx)
    }
  } catch (err) {
    console.error(err)
  }
}
