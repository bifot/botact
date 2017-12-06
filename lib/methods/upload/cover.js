const rp = require('request-promise')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

module.exports = async function (file, settings) {
  try {
    const { api, settings: botSettings } = this
    const { group_id, token: access_token } = botSettings

    if (!group_id) {
      throw 'group_id is required'
    }

    const { response: { upload_url: url } } = await api('photos.getOwnerCoverPhotoUploadServer', {
      ...settings,
      group_id,
      access_token,
      v: 5.69
    })

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

    const cover = await api('photos.saveOwnerCoverPhoto', {
      ...body,
      access_token,
      v: 5.69
    })

    return cover
  } catch (err) {
    throw err
  }
}
