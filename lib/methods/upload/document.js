const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')

module.exports = function (file, peer_id, type = 'doc') {
  return new Promise((resolve, reject) => {
    this.execute('docs.getMessagesUploadServer', {
      type,
      peer_id
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
