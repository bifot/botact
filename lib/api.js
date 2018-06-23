const axios = require('axios')
const { stringify } = require('querystring')

module.exports = async function api(method, options = {}) {
  try {
    const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify({
      ...options,
      v: this.settings && this.settings.v ? this.settings.v : 5.78,
      access_token: options.access_token || this.settings.token,
    }))

    if (data.error) {
      throw data
    }

    return data
  } catch (error) {
    throw new Error(JSON.stringify(error))
  }
}
