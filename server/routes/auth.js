const express = require('express');
const jwt = require('jsonwebtoken');

const database = require('../database.js')

const router = express.Router();

router.post('/register', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const check_username_query = "SELECT * FROM `users` WHERE `username` = '" + username + "'";

	database.query(check_username_query, (error, data) => {
		if (error) return response.json(error);

		if (!data.length) {
			const register_query = "INSERT INTO `users` (`username`, `password`) VALUES ('" + username + "', '" + password + "');"

			database.query(register_query, (error, data) => {
				if (error) return response.json(error);
				return response.json({success: true, message: data});
			})
		} else {
			response.status(409).json({success: false, message: "Username is already taken."});
		}
	})
});

router.post('/set_default_user_info', (request, response) => {
	const username = request.body.username;

	const sql_query = "INSERT INTO `users_info` (`name`) VALUES ('" + username + "');"

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);
		return response.json({success: true, message: data});
	})
});

router.post('/login', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const sql_query = "SELECT * FROM `users` WHERE `username` = '" + username + "' AND `password` = '" + password + "';"

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			const signed_token = jwt.sign({ id: data[0].id }, jwt_key);
			response.json({success: true, token: signed_token, admin: data[0].admin, user_id: data[0].id});
		} else {
			response.status(404).json({success: false, message: 'No user found.'});
		}
	})
});

router.get('/verify/:id', (request, response) => {
	const token = request.headers['authorization'];
	const user_id = request.params.id;

	if (token) {
		try {
			const decoded_token = jwt.verify(token, jwt_key);

			if (decoded_token.id == user_id) { 
				let isAdmin;

				const sql_query = "SELECT `id`,`admin` FROM `users` WHERE `id` = " + decoded_token.id;

				database.query(sql_query, (error, data) => {
					if (error) return response.json(error);

					if (data[0].admin == 1) isAdmin = data[0].admin;

					response.json({success: true, message: "User is logged in.", admin: isAdmin});
				})

			} else {
				response.status(401).json({success: false, message: "Passed token does not correspond to the passed user ID."});
			}

		} catch (error) {
			response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."})
		}
	} else {
		response.status(401).json({success: false, message: "User is not logged in."})
	}
});

module.exports = router;