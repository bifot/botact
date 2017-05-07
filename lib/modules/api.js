const request = require('request')

module.exports = (method, options) => {
  const settings = options || {}

  if (!settings.v) {
    settings.v = 5.63
  }

  return new Promise((resolve, reject) => {
    request({
      url: `https://api.vk.com/method/${method}`,
      method: 'POST',
      form: settings,
      json: true
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(err)
      }
    })
  })
}
