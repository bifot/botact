const fs = require('fs')
const path = require('path')
const mime = require('mime')
const rp = require('request-promise')
const checkServer = require('../../utils/checkServer')

module.exports = function uploadPhoto(file, peer_id) {
	if (arguments[2]) {
		console.log('Second attempt!')
	}
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

        const serverIsUp = await checkServer(url)

        if (!serverIsUp) {
        	if (arguments[2]) {
        		console.log('Sending error message to user')
        		this.reply(peer_id, 'У меня не получилось загрузить фото. Попробуй ещё раз!')
        	}

        	console.error('VK server does not exist, trying again...')
        	uploadPhoto.call(this, file, peer_id, true)
        	
        	return
        }

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
