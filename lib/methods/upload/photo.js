const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')

module.exports = function (file, peer_id) {
  return new Promise((resolve, reject) => {
    const { token: access_token } = this.settings

    this.execute('photos.getMessagesUploadServer', {
      peer_id,
      access_token
    }, async ({ response, error }) => {
      if (error) {
        reject(error)
      }

      try {
        const { upload_url: url } = response

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

        this.execute('photos.saveMessagesPhoto', {
          ...body,
          access_token
        }, ({ response, error }) => {
          if (error) {
            reject(error)
          }

          resolve(response[0])
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}
