const path = require('path')
const { Botact } = require('../index')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  token: process.env.TOKEN,
  admin: process.env.ADMIN_TOKEN
})

const uploadAttachments = async () => {
  const book = await bot.uploadDocument(path.join(__dirname, 'files', 'book.pdf')) // { id: 445225557, ... }
  const girl = await bot.uploadPhoto(path.join(__dirname, 'files', 'girl.png')) // { id: 456246067, ... }
}
