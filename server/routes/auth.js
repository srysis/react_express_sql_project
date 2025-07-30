const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../database.js')

const router = express.Router();

router.post('/register', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const check_username_query = "SELECT * FROM `users` WHERE `username` = '" + username + "'";

	database.query(check_username_query, (error, data) => {
		if (error) return response.json(error);

		if (!data.length) {
			bcrypt.hash(password, 13)
			.then((hash) => {
				const register_query = "INSERT INTO `users` (`username`, `password`) VALUES ('" + username + "', '" + hash + "');"

				database.query(register_query, (error, data) => {
					if (error) return response.json(error);
					return response.json({success: true, message: data});
				})
			})
			.catch(error => {
				console.error(error)
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

	const find_username_query = "SELECT * FROM `users` WHERE `username` = '" + username + "'";

	database.query(find_username_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			bcrypt.compare(password, data[0].password)
			.then((result) => {
				if (result) {
					const access_token = jwt.sign({ id: data[0].id }, access_key, { expiresIn: '1h' });

					const refresh_token = jwt.sign({ id: data[0].username }, refresh_key, { expiresIn: '1d' });

					response.cookie('refresh_token', refresh_token, {
						httpOnly: true,
						path: '/',
						domain: "localhost",
						secure: false,
						sameSite: "lax",
						maxAge: 86400000
					});

					response.json({success: true, token: access_token, admin: data[0].admin, user_id: data[0].id});
				} else {
					response.status(404).json({success: false, message: 'Invaild credentials.'});
				}
			})
		} else {
			response.status(404).json({success: false, message: 'Invaild credentials.'});
		}
	})
});

router.get('/verify/:id', (request, response) => {
	const token = request.headers['authorization'];
	const user_id = request.params.id;

	if (token) {
		try {
			const decoded_token = jwt.verify(token, access_key);

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

router.post('/refresh/:id', (request, response) => {
	const user_id = request.params.id;

	if (request.cookies?.refresh_token) {
		const refresh_token = request.cookies.refresh_token;

		try {
			const decoded_refresh_token = jwt.verify(refresh_token, refresh_key);

			const access_token = jwt.sign({ id: user_id }, access_key, { expiresIn: '1h' });

			response.json({success: true, token: access_token});
		} catch (error) {
			response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
		}
	} else {
		response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
	}
})

module.exports = router;