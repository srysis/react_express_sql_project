const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');
const dot_env = require('dotenv');

const authenticator = require('./middlewares/auth')

const app = express();
app.use(express.json());
app.use(cors());

dot_env.config();

global.port = process.env.PORT;
global.jwt_key = process.env.SECRET_KEY;

const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'forum_db'
});

// root
app.get('/', (request, response) => {
	response.json(`This is a root of localhost on port ${port}.`);
});

app.post('/register', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const sql_query = "INSERT INTO `users` (`id`, `username`, `password`) VALUES (LAST_INSERT_ID(), '" + username + "', '" + password + "');"

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);
		return response.json({success: true, message: data});
	})
});

app.post('/set_default_user_info', (request, response) => {
	const username = request.body.username;

	const sql_query = "INSERT INTO `users_info` (`user_id`, `name`) VALUES (LAST_INSERT_ID(), '" + username + "');"

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);
		return response.json({success: true, message: data});
	})
});

app.post('/login', (request, response) => {
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

app.get('/verify/:id', (request, response) => {
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

app.get('/user/:id', (request, response) => {
	const token = request.headers['authorization'];
	const requested_id = request.params.id;

	if (requested_id) {
		const sql_query = "SELECT * FROM `users_info` WHERE `user_id` = '" + requested_id + "';"

		database.query(sql_query, (error, data) => {

			if (error) return response.json(error);

			if (data.length) {
				try {
					const decoded_token = jwt.verify(token, jwt_key);

					if (decoded_token.id === data[0].user_id) {
						response.json({success: true, message: "User found and client owns this user.", ownership: true, user_info: data[0]});
					} else {
						response.json({success: true, message: "User found, but client does not own this user.", ownership: false, user_info: data[0]});
					}

				} catch (error) {
					response.json({success: true, message: "User found, but client does not own this user and is not logged in.", ownership: false, user_info: data[0]});
				}
			} else {
				response.json({success: false, message: 'No user found.'});
			}
		})

	} else {
		response.json({success: false, message: "No authorization header passed."});
	}
});

app.patch('/user/:id/edit', authenticator, (request, response) => {
	const requested_id = request.params.id;
	const user_data = request.body.new_user_data;

	const sql_query = "UPDATE `users_info` SET `name` = '" + user_data.name + "', `description` = '" + user_data.description + "' WHERE `users_info`.`user_id` = " + requested_id; 

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);

		response.json({success: true, message: "User's info was updated successfully."});
	})
})

app.delete('/user/:id/delete', authenticator, (request, response) => {
	const requested_id = request.params.id;

	const delete_user_info_query = "DELETE FROM users_info WHERE `users_info`.`user_id` = " + requested_id;
	const delete_user_query = "DELETE FROM `users` WHERE `users`.`id` = " + requested_id;

	database.query(delete_user_info_query, (error, data) => {
		if (error) return response.json(error);

		database.query(delete_user_query, (error, data) => {
			if (error) return response.json(error);

			response.json({success: true, message: "User record was deleted."});
		})
	})
})

app.get('/search/:queue', (request, response) => {
	const search_queue = request.params.queue;

	if (search_queue) {
		const sql_query = "SELECT * FROM `users_info` WHERE `name` LIKE '%" + search_queue + "%'"

		database.query(sql_query, (error, data) => {
			if (error) return response.json(error);

			if (data.length) { 
				response.json({results: data}) 
			} else {
				response.json({results: []});
			}
		})
	} else {
		response.json({results: []});
	}
})

app.listen(port, () => {console.log(`server runs on port ${port}`)});