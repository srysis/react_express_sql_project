const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../database.js');

const checkPostOwner = require('../middlewares/checkPostOwner.js');
const checkAdminRights = require('../middlewares/checkAdminRights.js');

const findDifferenceBetweenDates = require('../modules/date.js');

const change_rating_routes = require('./rating.js');

const router = express.Router();

router.use('/', change_rating_routes);

router.get('/posts', (request, response) => {
	const limit = request.query.limit;
	const offset = request.query.offset;

	const get_all_posts_within_limit_query = "SELECT `users_info`.`name` AS `post_author_name`, `users_info`.`profile_picture` AS `post_author_avatar`, `user_posts`.*, CAST(SUM(`user_posts_ratings`.`like`) AS SIGNED) AS likes_amount, " +
								"CAST(SUM(`user_posts_ratings`.`dislike`) AS SIGNED) AS dislikes_amount FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` " + 
								"INNER JOIN `user_posts_ratings` ON `user_posts`.`post_id` = `user_posts_ratings`.`post_id` GROUP BY `user_posts`.`post_id` " + 
								"ORDER BY `user_posts`.`post_date` DESC LIMIT " + limit + " OFFSET " + offset;

	database.query(get_all_posts_within_limit_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			const current_date = new Date(Date.now());

			for (let row of data) {
				let post_date = new Date(row.post_date);

				row.date_difference = findDifferenceBetweenDates(post_date, current_date);
			}

			response.json({posts: data});
		} else {
			response.json({posts: null});
		}
	})
});

router.get('/post/:post_id', checkPostOwner, (request, response) => {
	const requested_post_id = request.params.post_id;

	const select_post_query = "SELECT * FROM `user_posts` WHERE `post_id` = " + requested_post_id;

	database.query(select_post_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			const check_author_query = "SELECT `user_id`, `name` FROM `users_info` WHERE `user_id` = " + data[0].post_author;

			database.query(check_author_query, (error, data) => {
				if (error) return response.json(error);

				if (!data.length) {
					const get_post_by_id_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author`, `user_posts`.`post_type`, " + 
												 "CAST(SUM(`user_posts_ratings`.`like`) AS SIGNED) AS likes_amount, CAST(SUM(`user_posts_ratings`.`dislike`) AS SIGNED) AS dislikes_amount " + 
												 "FROM `user_posts` LEFT JOIN `users_info` ON `user_posts`.`post_author` = `users_info`.`user_id` INNER JOIN `user_posts_ratings` ON `user_posts`.`post_id` = `user_posts_ratings`.`post_id` " +
								 				 "WHERE `user_posts`.`post_id` = '" + requested_post_id + "' GROUP BY `user_posts`.`post_id`";

					database.query(get_post_by_id_query, (error, data) => {
						if (error) return response.json(error);

						if (data.length) {
							const post_date = new Date(data[0].post_date);
							const current_date = new Date(Date.now());

							response.json({post: data[0], date_difference: findDifferenceBetweenDates(post_date, current_date), post_ownership: response.locals.post_ownership})
						} else {
							response.json({message: "Post does not exist or was deleted by it's author.", post: null})
						}
					})

				} else {
					const get_post_by_id_query = "SELECT `users_info`.`name` AS `post_author_name`, `users_info`.`profile_picture` AS `post_author_avatar`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author`, `user_posts`.`post_type`, `user_posts`.`is_editable`, " +
								 "CAST(SUM(`user_posts_ratings`.`like`) AS SIGNED) AS likes_amount, CAST(SUM(`user_posts_ratings`.`dislike`) AS SIGNED) AS dislikes_amount " + 
								 "FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` INNER JOIN `user_posts_ratings` ON `user_posts`.`post_id` = `user_posts_ratings`.`post_id` " +
								 "WHERE `user_posts`.`post_id` = '" + requested_post_id + "' GROUP BY `user_posts`.`post_id`";

					database.query(get_post_by_id_query, (error, data) => {
						if (error) return response.json(error);

						if (data.length) {
							const post_date = new Date(data[0].post_date);
							const current_date = new Date(Date.now());

							response.json({post: data[0], date_difference: findDifferenceBetweenDates(post_date, current_date), post_ownership: response.locals.post_ownership})
						} else {
							response.json({message: "Post does not exist or was deleted by it's author.", post: null})
						}
					})
				}
			})
		} else {
			response.json({message: "Post does not exist or was deleted by it's author.", post: null})
		}
	})
});

router.patch('/post/:post_id/edit', checkPostOwner, (request, response) => {
	const requested_post_id = request.params.post_id;

	if (response.locals.post_ownership) {
		const new_post_content = request.body.new_post_content.replace(/'/g, "\\'");

		const update_post_query = "UPDATE `user_posts` SET `post_content` = '" + new_post_content + "' WHERE `user_posts`.`post_id` = " + requested_post_id;

		database.query(update_post_query, (error, data) => {
			if (error) return response.json(error);

			response.json({success: true, message: "Post was updated successfully."});
		});
	} else {
		response.status(403).json({success: false, message: "Client does not own this post."});
	}
});

router.delete('/post/:post_id/delete', [checkPostOwner, checkAdminRights], (request, response) => {
	const token = request.headers['authorization'];

	if (token) {
		const requested_post_id = request.params.post_id;
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
						if (response.locals.post_ownership) {
							try {
								const decoded_token = jwt.verify(token, access_key);

								if (decoded_token.id == user_id) {
									const delete_post_query = "DELETE FROM `user_posts` WHERE `post_id` = " + requested_post_id;

									database.query(delete_post_query, (error, data) => {
										if (error) return response.status(500).json({success: false, message: "Something went wrong."});

										const delete_related_comments_query = "DELETE FROM `comments` WHERE `post_id` = " + requested_post_id;

										database.query(delete_related_comments_query, (error, data) => {
											if (error) return response.status(500).json({success: false, message: "Something went wrong."});

											const delete_ratings_query = "DELETE FROM `user_posts_ratings` WHERE (`post_id` = '" + requested_post_id + "') and (`user_id` = '" + user_id + "')";

											database.query(delete_ratings_query, (error, data) => {
												if (error) return response.status(500).json({success: false, message: "Something went wrong."});

												response.json({success: true, message: "Post was deleted."});
											})
										})
									});
								} else {
									response.status(401).json({success: false, message: "Passed token does not correspond to the passed user ID."});
								}
							} catch (error) {
								console.log(error)
								response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
							}
						} else if (response.locals.isAdmin) {
							try {
								const decoded_token = jwt.verify(token, access_key);

								if (decoded_token.id == user_id) {
									const delete_post_query = "DELETE FROM `user_posts` WHERE `post_id` = " + requested_post_id;

									database.query(delete_post_query, (error, data) => {
										if (error) return response.status(500).json({success: false, message: "Something went wrong."});

										const delete_related_comments_query = "DELETE FROM `comments` WHERE `post_id` = " + requested_post_id;

										database.query(delete_related_comments_query, (error, data) => {
											if (error) return response.status(500).json({success: false, message: "Something went wrong."});

											const delete_ratings_query = "DELETE FROM `user_posts_ratings` WHERE (`post_id` = '" + requested_post_id + "') and (`user_id` = '" + user_id + "')";

											database.query(delete_ratings_query, (error, data) => {
												if (error) return response.status(500).json({success: false, message: "Something went wrong."});

												response.json({success: true, message: "Post was deleted."});
											})
										})
									});
								}
							} catch (error) {
								console.log(error)
								response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
							}
						} else {
							response.status(403).json({success: false, message: "Client is not allowed to delete this post."});
						}
					} else {
						response.status(401).json({success: false, message: "Invalid credentials supplied."});
					}
				})
				.catch(error => {
					response.status(401).json({success: false, message: "Invalid credentials supplied."});
				})
			} else {
				response.status(404).json({success: false, message: "Invalid credentials supplied."});
			}
		})
	} else {
		return response.status(401).json({success: false, message: "No authorization header passed."});
	}
});

module.exports = router;