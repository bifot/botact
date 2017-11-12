module.exports = (body, callbacks) => {
  const { response, error, execute_errors } = body

  if (error) {
    return console.error(eror)
  } else if (execute_errors) {
    return console.error(execute_errors)
  }

  response.forEach((item, i) => {
    const callback = callbacks[i]

    if (typeof callback === 'function') {
      callback(item)
    }
  })
}
