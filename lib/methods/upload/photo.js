const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')

module.exports = async function (file, peer_id) {
  try {
    const { token: access_token } = this.settings
    const { response: { upload_url: url } } = await this.api('photos.getMessagesUploadServer', {
      peer_id,
      access_token
    })

    const body = await rp({
      url,
      method: 'post',
      formData: {
        file: {
          value: fs.createReadStream(file),
          options: {
            filename: path.basename(file),
            contentType: mime.lookup(file)
          }
        }
      },
      json: true
    })

    const { response, error } = await this.api('photos.saveMessagesPhoto', {
      ...body,
      access_token
    })

    if (error) {
      throw error
    }

    return response[0]
  } catch (err) {
    throw err
  }
}
