const jwt = require('jsonwebtoken');

const database = require('../database.js');

function checkPostOwner(request, response, next) {	
	const token = request.headers['authorization'];
	const requested_post_id = request.params.post_id;

	const select_post_query = "SELECT * FROM `user_posts` WHERE `post_id` = " + requested_post_id;

	database.query(select_post_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			try {
				const decoded_token = jwt.verify(token, jwt_key);

				if (decoded_token.id === data[0].post_author) {
					next();
				} else {
					response.status(403).json({success: false, message: "Client does not own this post.", post_ownership: false});
				}
			} catch (error) {
				response.status(401).json({success: false, message: "Client must be logged in.", post_ownership: false});
			}
		} else {
			response.json({success: false, message: "Nothing to delete.", post_ownership: false});
		}
	});
}

module.exports = checkPostOwner;