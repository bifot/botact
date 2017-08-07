const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')

module.exports = function (file) {
  return new Promise((resolve, reject) => {
    return this.execute('photos.getMessagesUploadServer', null, 'user', (body) => {
      if (!body.upload_url) {
        reject(body)
      }

      return rp({
        url: body.upload_url,
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
        .then(body => this.execute('photos.saveMessagesPhoto', body, 'user', resolve))
        .catch(reject)
    })
  })
}
