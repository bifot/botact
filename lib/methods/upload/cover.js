const rp = require('request-promise')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

module.exports = async function (file, settings) {
  try {
    const { group_id, token: access_token } = this.settings

    if (!group_id) {
      throw new Error('group_id is required')
    }

    const { response: { upload_url: url } } = await this.api('photos.getOwnerCoverPhotoUploadServer', {
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

    const { response, error } = await this.api('photos.saveOwnerCoverPhoto', {
      ...body,
      access_token,
      v: 5.69
    })

    if (error) {
      throw new Error(JSON.stringify(error))
    }

    return response
  } catch (error) {
    throw new Error(JSON.stringify(error))
  }
}
