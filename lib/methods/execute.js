module.exports = function(method, settings, callback = () => {}) {
  const { access_token = this.settings.token } = settings

  const code = `API.${method}(${JSON.stringify(settings)})`

  // TODO: little rework
  const item = new function executionItem() {
    this.code = code
    this.callback = callback
    this.result = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }()

  const otherTokenItems = this.methods.filter(item => item.access_token !== access_token)
  const currentTokenItems = this.methods.find(item => item.access_token === access_token)

  this.methods = [
    ...otherTokenItems,
    {
      access_token,
      items: [
        ...(currentTokenItems ? currentTokenItems.items : []),
        item,
      ],
    },
  ]

  return item.result
}
