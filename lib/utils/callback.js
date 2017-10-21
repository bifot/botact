module.exports = (methods, body) => {
  if (!body.response) {
    if (body.execute_errors) {
      body.execute_errors.forEach((err) => {
        console.error(err.error_msg)
      })
    } else {
      console.error(body.error.error_msg)
    }

    return false
  }

  body.response.forEach((body, i) => {
    const callback = methods.api[Object.keys(methods.api)[i]]

    if (typeof callback === 'function') {
      callback(body)
    }
  })
}
