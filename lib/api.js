const axios = require('axios')
const { stringify } = require('querystring')

module.exports = async function (method, options = {}) {
  if (!options.v) {
    options.v = (this.settings && this.settings.v) || 5.78
  }

  if (!options.access_token) {
    options.access_token = this.settings.token
  }

  try {
    const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify(options))
    const { error } = data

    if (error) {
      throw data
    }

    return data
  } catch (error) {
    throw new Error(JSON.stringify(error))
  }
}
