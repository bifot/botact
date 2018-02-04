const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')

module.exports = function (file, type) {
  return new Promise((resolve, reject) => {
    const { user } = this.settings

    this.execute('docs.getUploadServer', {
      type,
      access_token: user
    }, async ({ response }) => {
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

      this.execute('docs.save', body, resolve)
    })
  })
}
