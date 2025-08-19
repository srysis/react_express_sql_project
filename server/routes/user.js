const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const dot_env = require('dotenv');
const vercel_blob = require('@vercel/blob');

const database = require('../database.js')
const authenticator = require('../middlewares/auth.js');

const findDifferenceBetweenDates = require('../modules/date.js');

const imageUpload = multer();

dot_env.config();

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
					const decoded_token = jwt.verify(token, access_key);

					if (decoded_token.id === data[0].user_id) {
						response.json({success: true, message: "User found and client owns this user.", ownership: true, user_info: data[0]});
					} else {
						response.json({success: true, message: "User found, but client does not own this user.", ownership: false, user_info: data[0]});
					}

				} catch (error) {
					response.json({success: true, message: "User found, but client does not own this user and is not logged in.", ownership: false, user_info: data[0]});
				}
			} else {
				response.json({success: false, message: 'No user found.', user_info: null});
			}
		})

	} else {
		response.json({success: false, message: "No user ID passed."});
	}
});

router.get('/:id/posts', (request, response) => {
	const requested_id = request.params.id;

	const get_posts_of_one_user_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.* " +
										"FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` " +
										"WHERE `user_posts`.`post_author` = '" + requested_id + "' ORDER BY `user_posts`.`post_date` DESC";

	database.query(get_posts_of_one_user_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			const current_date = new Date(Date.now());

			for (let row of data) {
				let post_date = new Date(row.post_date);

				row.date_difference = findDifferenceBetweenDates(post_date, current_date);
			}

			response.json({results: data})
		} else {
			response.json({message: "User has no posts."})
		}
	})
});

router.post('/:id/create_text_post', authenticator, (request, response) => {
	const user_id = request.params.id;
	const post = request.body.post;

	const sql_query = "INSERT INTO `user_posts` (`post_id`, `post_title`, `post_content`, `post_date`, `post_author`, `post_type`) VALUES (NULL, '" + 
						post.post_title.replace(/'/g, "\\'") + "', '" + post.post_content.replace(/'/g, "\\'") + "', CURRENT_TIMESTAMP, '" + user_id + "', 'text');";

	database.query(sql_query, (error, data) => {
		if (error) return response.json(error);

		response.json({success: true, message: "Posted.", post_content: post, post_id: data.insertId});
	})
});

router.post('/:id/create_image_post', [authenticator, imageUpload.single("post_image")], (request, response) => {
	const user_id = request.params.id;

	const post_title = request.body.post_title;
	const image_data = request.file;

	if (image_data.mimetype != 'image/png') {
		response.status(400).json({success: false, message: "Image has to be PNG."});
	} else {
		const blob = uploadImageToVercel('posts/', image_data, image_data.buffer)
					.then((result) => {
					 	if (result.url) {
							const sql_query = "INSERT INTO `user_posts` (`post_id`, `post_title`, `post_content`, `post_date`, `post_author`, `post_type`) VALUES (NULL, '" + 
											   post_title.replace(/'/g, "\\'") + "', '" + image_data.originalname + "', CURRENT_TIMESTAMP, '" + user_id + "', 'image');";

							database.query(sql_query, (error, data) => {
								if (error) return response.json(error);

								response.json({success: true, message: "Posted.", post_id: data.insertId});
							})
						}
					})
					.catch((error) => {
						console.error(error);
						response.status(500).json({success: false, error: error});
					});
	}
})

router.post('/:id/upload_profile_picture', [authenticator, imageUpload.single("profile_picture")], (request, response) => {
	const requested_id = request.params.id;

	const image_data = request.file;

	if (image_data.mimetype != 'image/png') {
		response.status(400).json({success: false, message: "Image has to be PNG."});
	} else {
		sharp(image_data.buffer)
		.png()
		.resize(200, 200, { resizeMode: "outside", withoutEnlargement: true })
		.toBuffer()
		.then((data, info) => {
			const blob = uploadImageToVercel('/', image_data, data)
						.then((result) => {
						 	if (result.url) {
							const get_previous_image_query = "SELECT `profile_picture` FROM `users_info` WHERE `user_id` = " + requested_id;

							const set_image_path_query = "UPDATE `users_info` SET `profile_picture` = '" + result.pathname + "' WHERE `users_info`.`user_id` = " + requested_id;

							database.query(get_previous_image_query, (error, data) => {
								if (error) return response.json(error);

								const previous_image = data[0].profile_picture;

								database.query(set_image_path_query, (error, data) => {
									if (error) return response.json(error);

									deleteImageFromVercel(previous_image);

									response.json({success: true, message: "Profile picture has been updated"});
								})
							})
						}
						})
						.catch((error) => {
							console.error(error);
							response.status(500).json({success: false, error: error});
						});
		})
	}
});

async function uploadImageToVercel(pathname, original_image_data, buffer) {
	const blob = await vercel_blob.put(`${pathname}${original_image_data.originalname}`, buffer, { 
		access: 'public',
		allowOverwrite: true,
		token: process.env.BLOB_READ_WRITE_TOKEN
	});

	return blob;
}
function deleteImageFromVercel(image_name) {
	vercel_blob.del(`https://nzeeldk4zw3dccii.public.blob.vercel-storage.com/${image_name}`, {
		token: process.env.BLOB_READ_WRITE_TOKEN
	});
}

router.patch('/:id/edit', authenticator, (request, response) => {
	const requested_id = request.params.id;
	const username = request.body.username;
	const description = request.body.description.replace(/'/g, "\\'");

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