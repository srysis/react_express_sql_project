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
					response.locals.post_ownership = true;
				} else {
					response.locals.post_ownership = false;
				}
			} catch (error) {
				response.locals.post_ownership = false;
			}
		} else {
			response.locals.post_ownership = false;
		}

		next();
	});
}

module.exports = checkPostOwner;