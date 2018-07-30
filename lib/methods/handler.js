module.exports = async function(ctx) {
  try {
    const { token } = this.settings
    const { commands, hears, on } = this.actions
    const { scenes } = this.flow
    const { user_id, peer_id, body, text, attachments = [] } = ctx
    const types = attachments.map(item => item.type)
    const flow = !!this.redis && await this.redis.get(`flow_${token}_${user_id || peer_id}`)
    const command = commands.find(item => item.command === (body || text))
    const hear = hears.find(item => item.command.test(body || text))
    const reserved = on
      .sort((a, b) => b.type == 'message' ? -1 : 1)
      .find(({ type }) => types.indexOf(type) !== -1 || type === 'message')

    if (flow) {
      const { scene, step, session } = flow
      const { [scene]: callbacks } = scenes
      const callback = callbacks[step]

      if (!(command && command.isPriority)) {
        return callback({
          ...flow,
          ...ctx,
          session,
        })
      }
    }

    if (command) {
      command.callback(ctx)
    } else if (hear) {
      hear.callback(ctx)
    } else if (reserved) {
      reserved.callback(ctx)
    }
  } catch (err) {
    this.catch(err)
  }
}
