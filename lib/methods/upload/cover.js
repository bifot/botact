const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

module.exports = async function (file, settings) {
  try {
    const { group_id } = this.settings

    if (!group_id) {
      throw new Error('group_id is required')
    }

    const { response: { upload_url: url } } = await this.api('photos.getOwnerCoverPhotoUploadServer', {
      ...settings,
      group_id
    })

    const form = new FormData()
    form.append('photo', fs.createReadStream(file))

    const { data } = await axios.post(
      url,
      form,
      {
        headers: form.getHeaders()
      })

    const { response, error } = await this.api('photos.saveOwnerCoverPhoto', data)

    if (error) {
      throw new Error(JSON.stringify(error))
    }

    return response
  } catch (error) {
    throw new Error(JSON.stringify(error))
  }
}
