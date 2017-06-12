const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')
const api = require('../../modules/api')

module.exports = (self) => {
  return (file, type) => {
    return new Promise((resolve, reject) => {
      return self.execute('photos.getMessagesUploadServer', null, 'user', (body) => {
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
          .then(body => self.execute('photos.saveMessagesPhoto', body, 'user', resolve))
          .catch(reject)
      })
    })
  }
}
