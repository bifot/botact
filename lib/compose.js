const reduce = (prevBot, currentBot) => {
  for (const [key, methods] of Object.entries(currentBot)) {
    if (!prevBot[key]) {
      prevBot[key] = []
    }

    prevBot[key] = [
      ...prevBot[key],
      ...methods
    ]
  }

  return prevBot
}

module.exports = (...bots) => {
  return {
    ...bots[0],
    actions: bots
      .map((item) => item.actions)
      .reduce(reduce, {}),
    flow: {
      ...bots[0].flow,
      scenes: bots
        .map((item) => item.flow.scenes)
        .reduce(reduce, {})
    }
  }
}