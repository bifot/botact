module.exports = async function (ctx) {
  try {
    const { token } = this.settings
    const { commands, hears, on } = this.actions
    const { scenes } = this.flow
    const { user_id, body, attachments = [] } = ctx
    const types = attachments.map(item => item.type)
    const flow = this.redis && JSON.parse(await this.redis.getAsync(`flow:${token}:${user_id}`))

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

    const [ command ] = commands.filter(({ command }) => command === body)
    const [ hear ] = hears.filter(({ command }) => command.test(body))
    const [ reserved ] = on
      .sort((a, { type }) => type !== 'message')
      .filter(({ type }) => types.indexOf(type) > -1 || type === 'message')

    if (command) {
      command.callback(ctx)
    } else if (hear) {
      hear.callback(ctx)
    } else if (reserved) {
      reserved.callback(ctx)
    }
  } catch (err) {
    console.error(err)
  }
}
