module.exports = function(userId, message, attachment, keyboard) {
  return new Promise((resolve, reject) => {
    this.execute('messages.send', {
      user_ids: typeof userId === 'number' ? userId : userId.join(','),
      message,
      attachment,
      keyboard: keyboard
        ? JSON.stringify({
          ...keyboard,
          buttons: keyboard.buttons.map(item => item.map(item => ({
            ...item,
            action: {
              ...item.action,
              payload: JSON.stringify(item.action.payload),
            },
          }))),
        })
        : null,
    }, ({ response, error }) => {
      if (error) {
        reject({ error })
      } else {
        resolve({ response })
      }
    })
  })
}
