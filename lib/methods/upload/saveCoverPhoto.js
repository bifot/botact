const rp = require('request-promise')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

module.exports = function (file, settings) {
  return new Promise((resolve, reject) => {
    const { group_id, token } = this.settings

    if (!group_id) {
      return reject('group_id is required')
    }

    return this.execute('photos.getOwnerCoverPhotoUploadServer', {
      group_id
    }, token, (body) => {
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
        .then(body => this.api('photos.saveOwnerCoverPhoto', { ...body, ...settings, access_token: token }))
        .then(resolve)
        .catch(reject)
    })
  })
}
