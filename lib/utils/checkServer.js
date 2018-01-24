const urlExists = require('url-exists')

module.exports = (url) => {
	return new Promise ((resolve, reject) => {
		urlExists(url, (err, exists) => {
			if (err) {
				reject(err)
			}

			resolve(exists)
		})
	})
}