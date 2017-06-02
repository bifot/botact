const fs = require('fs')
const path = require('path')
const mime = require('mime')
const request = require('request')
const api = require('../../modules/api')

module.exports = (self) => {
  return (file, type) => {
    return new Promise((resolve, reject) => {
      if (!self.settings.admin) {
        throw 'Cannot find admin\'s token'
      }

      api('docs.getUploadServer', {
        access_token: self.settings.admin,
        type: type
      }).then(body => {
        if (!body.response || !body.response.upload_url) {
          reject(body)
        }

        const data = {
          file: {
            value: fs.createReadStream(file),
            options: {
              filename: path.basename(file),
              contentType: mime.lookup(file)
            }
          }
        }

        request({
          url: body.response.upload_url,
          method: 'POST',
          formData: data,
          json: true
        }, (err, res, body) => {
          if (err === null && res.statusCode === 200) {
            api('docs.save', {
              file: body.file,
              access_token: self.settings.admin
            }).then(body => {
              if (body.response && body.response[0]) {
                resolve(body.response[0])
              } else {
                reject(body)
              }
            }).catch(reject)
          } else {
            reject(err)
          }
        })
      }).catch(reject)
    })
  }
}
