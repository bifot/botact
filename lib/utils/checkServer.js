const rp = require('request-promise')

module.exports = async (url) => {
	try {
		const response = await rp({
			method: 'HEAD',
			uri: url
		})

		return true
	} catch (err) {
		return false
	}
}