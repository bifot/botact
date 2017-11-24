const path = require('path')
const { Botact } = require('../index')
const { confirmation, token, admin } = require('../config')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION || confirmation,
  token: process.env.TOKEN || token,
  admin: process.env.ADMIN || admin
})

const uploadAttachments = async () => {
  const book = await bot.uploadDocument(path.join(__dirname, 'files', 'book.pdf')) // { id: 445225557, ... }
  const girl = await bot.uploadPhoto(path.join(__dirname, 'files', 'girl.png')) // { id: 456246067, ... }
}
