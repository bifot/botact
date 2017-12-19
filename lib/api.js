const rp = require('request-promise')

module.exports = async (method, options = {}) => {
  if (!options.v) {
    options.v = 5.69
  }

  try {
    const body = await rp({
      url: `https://api.vk.com/method/${method}`,
      method: 'post',
      formData: options,
      json: true
    })

    const { error } = body

    if (error) {
      throw body
    }

    return body
  } catch (err) {
    throw err
  }
}
