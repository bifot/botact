const axios = require('axios')
const { stringify } = require('querystring')

module.exports = async function(method, options = {}) {
  try {
    const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify({
      ...options,
      v: this.settings && this.settings.v ? this.settings.v : 5.78,
      access_token: options.access_token || this.settings.token,
    }))

    if (data.error) {
      if (this.catch) {
        this.catch(data)
      } else {
        throw new Error(JSON.stringify(data))
      }
    }

    return data
  } catch (error) {
    if (this.catch) {
      this.catch(err)
    } else {
      throw new Error(JSON.stringify(error))
    }
  }
}
