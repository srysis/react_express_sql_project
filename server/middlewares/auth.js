const jwt = require('jsonwebtoken');

function authenticator(request, response, next) {
	const token = request.headers['authorization'];
	const user_id = request.params.id;
	
	if (token) {
		try {
			const decoded_token = jwt.verify(token, jwt_key);

			if (decoded_token) {
				if (decoded_token.id == user_id) {
					next();
				} else {
					response.status(401).json({success: false, message: "Passed token does not correspond to the passed user ID."})
				}
			}
		} catch (error) {
			console.log(error)
			response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."})
		}
		
	} else {
		response.status(401).json({success: false, message: "No authorization header passed."})
	}
}

module.exports = authenticator;