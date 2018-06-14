module.exports = function (user_id, message, attachment, keyboard) {
  return new Promise((resolve, reject) => {
    this.execute('messages.send', {
      user_ids: typeof user_id === 'number' ? user_id : user_id.join(','),
      message,
      attachment,
      keyboard: keyboard
        ? JSON.stringify({
          ...keyboard,
          buttons: keyboard.buttons.map(item => item.map((item) => ({
            ...item,
            action: {
              ...item.action,
              payload: JSON.stringify(item.action.payload)
            }
          })))
        })
        : null
    }, ({ response, error }) => {
      if (error) {
        reject({ error })
      }

      resolve({ response })
    })
  })
}
