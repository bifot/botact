module.exports = function (user_id, message, attachment) {
  return new Promise((resolve, reject) => {
    this.execute('messages.send', {
      user_ids: typeof user_id === 'number' ? user_id : user_id.join(','),
      message,
      attachment
    }, ({ response, error }) => {
      if (error) {
        reject({ error })
      }

      resolve({ response })
    })
  })
}
