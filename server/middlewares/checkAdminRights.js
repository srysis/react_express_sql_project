const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../database.js');

function checkAdminRights(request, response, next) {
	const token = request.headers['authorization'];

	if (token) {
		const username = request.body.user_credentials.username;
		const password = request.body.user_credentials.password;
		const user_id = request.body.user_id;

		const select_user_query = "SELECT * FROM `users` WHERE `username` = '" + username + "' AND `id` = " + user_id;

		database.query(select_user_query, (error, data) => {
			if (error) return response.status(500).json({success: false, message: "Something went wrong."});

			if (data.length) {
				bcrypt.compare(password, data[0].password)
				.then(result => {
					if (result) {
						if (data[0].admin) {
							try {
								const decoded_token = jwt.verify(token, access_key);

								if (decoded_token.id == user_id) {
									response.locals.isAdmin = true;
								} else {
									response.locals.isAdmin = false;
								}
							} catch (error) {
								if (error.name == "TokenExpiredError") {
									return response.status(401).json({success: false, message: "Passed token has been expired.", refreshable: true});
								} else {
									response.locals.isAdmin = false;
								}
							}
						}
					} else {
						response.locals.isAdmin = false;
					}
				})
			} else {
				response.locals.isAdmin = false;
			}

			next();
		})
	} else {
		return response.status(401).json({success: false, message: "No authorization header passed."});
	}
}

module.exports = checkAdminRights;