const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

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

        const form = new FormData()
        form.append('photo', fs.createReadStream(file))

        const { data } = await axios.post(
          url,
          form,
          {
            headers: form.getHeaders(),
          })

        this.execute('photos.saveMessagesPhoto', {
          ...data,
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
