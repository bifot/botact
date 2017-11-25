const rp = require('request-promise')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

module.exports = function (file, {cropx, cropy, crop_x2, crop_y2 }) {
  return new Promise((resolve, reject) => {
    if (!this.settings.group_id) {
      return reject('group_id is required')
    }

    return this.execute('photos.getOwnerCoverPhotoUploadServer', {
      group_id: this.settings.group_id
    }, this.settings.token, (body) => {
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
        .then(body => this.api('photos.saveOwnerCoverPhoto', Object.assign({}, body, { cropx, cropy, crop_x2, crop_y2, access_token: this.settings.token })))
        .then(resolve)
        .catch(reject)
    })
  })
}
