const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

const SharpMulter = require('sharp-multer')

const database = require('../database.js')
const authenticator = require('../middlewares/auth.js');

const storage = SharpMulter({
	destination: function(request, file, cb) {
		// supposedly, multer considers root directory to be the one that contains a file from which the server is being run ('server.js' in this case)
		// that's why putting '../public' as destination would create a 'public' folder one level above 'root' directory
		cb(null, './public') 
	},
	imageOptions: {
		fileFormat: "png",
		quality: 80,
		resize: { width: 200, height: 200, resizeMode: "outside", withoutEnlargement: true }
	}
})



const imageUpload = multer({storage})

const router = express.Router();

router.get('/:id', (request, response) => {
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
		response.json({success: false, message: "No user ID passed."});
	}
});

router.get('/:id/posts', (request, response) => {
	const requested_id = request.params.id;

	const get_posts_of_one_user_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " +
										"FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` " +
										"WHERE `user_posts`.`post_author` = " + requested_id + ";";

	database.query(get_posts_of_one_user_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			response.json({results: data})
		} else {
			response.json({message: "User has no posts."})
		}
	})
});

router.post('/:id/create_post', authenticator, (request, response) => {
	const user_id = request.params.id;
	const post = request.body.post;

	const sql_query = "INSERT INTO `user_posts` (`post_id`, `post_title`, `post_content`, `post_date`, `post_author`) VALUES (NULL, '" + 
						post.post_title + "', '" + post.post_content + "', CURRENT_TIMESTAMP, '" + user_id + "');";

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);

		response.json({success: true, message: "Posted.", post_content: post, post_id: data.insertId});
	})
});

router.post('/:id/upload_profile_picture', [authenticator, imageUpload.single("image-name")], (request, response) => {
	const requested_id = request.params.id;

	const new_file_name = request.file.originalname.split(".")[0] + ".png";

	const set_image_path_query = "UPDATE `users_info` SET `profile_picture` = '" + new_file_name + "' WHERE `users_info`.`user_id` = " + requested_id;

	database.query(set_image_path_query, (error, data) => {
		if (error) return response.json({success: false, error: error});

		response.json({success: true, message: "Profile picture has been updated"})
	})
})

router.patch('/:id/edit', authenticator, (request, response) => {
	const requested_id = request.params.id;
	const username = request.body.username;
	const description = request.body.description;

	const sql_query = "UPDATE `users_info` SET `name` = '" + username + "', `description` = '" + description + "' WHERE `users_info`.`user_id` = " + requested_id; 

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);

		response.json({success: true, message: "User's info was updated successfully."});
	})
});

router.delete('/:id/delete', authenticator, (request, response) => {
	const requested_id = request.params.id;
	const username = request.body.username;
	const password = request.body.password;

	const select_user_query = "SELECT * FROM `users` WHERE `username` = '" + username + "' AND `id` = " + requested_id;

	database.query(select_user_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			bcrypt.compare(password, data[0].password)
			.then((result) => {
				if (result) {

					const delete_user_info_query = "DELETE FROM users_info WHERE `users_info`.`user_id` = " + requested_id;
					const delete_user_query = "DELETE FROM `users` WHERE `users`.`id` = " + requested_id;

					database.query(delete_user_info_query, (error, data) => {
						if (error) return response.json(error);

						database.query(delete_user_query, (error, data) => {
							if (error) return response.json(error);

							response.json({success: true, message: "User record was deleted."});
						})
					})

				} else {
					response.status(404).json({success: false, message: 'Invaild credentials.'});
				}
			})
		} else {
			response.status(403).json({success: false, message: "Client attempted to delete a user that is not owned by the client."});
		}
	})
});

module.exports = router;