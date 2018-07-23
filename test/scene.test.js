const { expect } = require('chai')
const { bot, redis } = require('./test.config.js')

describe('scene', () => {
  it('add scene', () => {
    const sceneName = 'simple'
    const callbacks = [ () => {}, () => {} ]

    bot.addScene(sceneName, callbacks)

    expect(bot.flow.scenes).to.deep.equal({ [sceneName]: callbacks })
  })

  it('join scene', async () => {
    const { token } = bot.options
    const id = 1
    const sceneName = 'simple'
    const sessionInital = { foo: 'bar' }

    await bot.joinScene({
      user_id: id,
      redis,
      flow: bot.flow
    }, sceneName, sessionInital)

    const {
      scene,
      step,
      session
    } = await redis.get(`flow_${token}_${id}`)

    expect(scene).eq(sceneName)
    expect(step).eq(0)
    expect(session).to.deep.equal(sessionInital)
  })

  it('next scene', async () => {
    const { token } = bot.options
    const id = 1
    const sceneName = 'simple'
    const sessionInital = { foo: 'bar' }
    const sessionExtra = { bar: 'foo' }

    await bot.nextScene({
      user_id: id,
      redis,
      flow: bot.flow
    }, sessionExtra)

    const {
      scene,
      step,
      session
    } = await redis.get(`flow_${token}_${id}`)

    expect(scene).eq(sceneName)
    expect(step).eq(1)
    expect(session).to.deep.equal({ ...sessionInital, ...sessionExtra })
  })

  it('leave scene', async () => {
    const { token } = bot.options
    const id = 1

    bot.leaveScene({
      user_id: id,
      redis
    })

    const flow = await redis.get(`flow_${token}_${id}`)

    expect(flow).eq(null)
  })
})
