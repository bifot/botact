const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

module.exports = function(file, peerId, type) {
  return new Promise((resolve) => {
    this.execute('docs.getMessagesUploadServer', {
      type,
      peer_id: peerId,
    }, async ({ response }) => {
      const { upload_url: url } = response
      const form = new FormData()

      form.append('file', fs.createReadStream(file))

      const { data } = await axios.post(url, form, {
        headers: form.getHeaders(),
      })

      this.execute('docs.save', data, resolve)
    })
  })
}
