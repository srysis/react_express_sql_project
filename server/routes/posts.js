const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../database.js');

const checkPostOwner = require('../middlewares/checkPostOwner.js');

const router = express.Router();

function findDifferenceInDays(post_date, current_date) {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;

	const post_date_UTC = Date.UTC(post_date.getFullYear(), post_date.getMonth(), post_date.getDate());
	const current_date_UTC = Date.UTC(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());

	return Math.abs(Math.floor((current_date_UTC - post_date_UTC) / MS_PER_DAY));
}

function findDifferenceInMonths(post_date, current_date) {
	let ms_difference = (current_date.getTime() - post_date.getTime()) / 1000;
	ms_difference /= (60 * 60 * 24 * 7 * 4);

	return Math.abs(Math.floor(ms_difference));
}

function findDifferenceInYears(post_date, current_date) {
	let ms_difference = (current_date.getTime() - post_date.getTime()) / 1000;
	ms_difference /= (60 * 60 * 24);

	return Math.abs(Math.floor(ms_difference / 365.25));
}

function findDifferenceBetweenDates(post_date, current_date) {
	let date_difference = undefined;

	let difference_days = findDifferenceInDays(post_date, current_date);

	if (difference_days > 31) {
		let difference_months = findDifferenceInMonths(post_date, current_date);

		if (difference_months > 12) {
			let difference_years = findDifferenceInYears(post_date, current_date);

			date_difference = difference_years == 1 ? `${difference_years} year ago` : `${difference_years} years ago`;
		} else {
			date_difference = difference_months == 1 ? `${difference_months} month ago` : `${difference_months} months ago`;
		}
	} else {
		date_difference = difference_days == 1 ? `${difference_days} day ago` : `${difference_days} days ago`;
	}

	return date_difference;
}

router.get('/posts', (request, response) => {
	const get_all_posts_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " +
								"FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` ORDER BY `user_posts`.`post_date` DESC;"

	database.query(get_all_posts_query, (error, data) => {
		if (error) return response.json(error);

		response.json({posts: data});
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
					const get_post_by_id_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " + 
												 "FROM `user_posts` LEFT JOIN `users_info` ON `user_posts`.`post_author` = `users_info`.`user_id` " +
								 				 "WHERE `user_posts`.`post_id` = " + requested_post_id;

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
					const get_post_by_id_query = "SELECT `users_info`.`name` AS `post_author_name`, `users_info`.`profile_picture` AS `post_author_avatar`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " +
								 "FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` " +
								 "WHERE `user_posts`.`post_id` = " + requested_post_id;

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
		const new_post_content = request.body.new_post_content;

		const update_post_query = "UPDATE `user_posts` SET `post_content` = '" + new_post_content + "' WHERE `user_posts`.`post_id` = " + requested_post_id;

		database.query(update_post_query, (error, data) => {
			if (error) return response.json(error);

			response.json({success: true, message: "Post was updated successfully."});
		});
	} else {
		response.status(403).json({success: false, message: "Client does not own this post."});
	}
});

router.delete('/post/:post_id/delete', checkPostOwner, (request, response) => {
	const token = request.headers['authorization'];
	const requested_post_id = request.params.post_id;
	const username = request.body.user_credentials.username;
	const password = request.body.user_credentials.password;
	const user_id = request.body.user_id;

	const select_user_query = "SELECT * FROM `users` WHERE `username` = '" + username + "' AND `id` = " + user_id;

	database.query(select_user_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			bcrypt.compare(password, data[0].password)
			.then(result => {
				if (result) {
					if (response.locals.post_ownership) {
						if (token) {
							try {
								const decoded_token = jwt.verify(token, access_key);

								if (decoded_token.id == user_id) {
									const delete_post_query = "DELETE FROM `user_posts` WHERE `post_id` = " + requested_post_id;

									database.query(delete_post_query, (error, data) => {
										if (error) return response.json(error);

										response.json({success: true, message: "Post was deleted."});
									});
								} else {
									response.status(401).json({success: false, message: "Passed token does not correspond to the passed user ID."});
								}
							} catch (error) {
								console.log(error)
								response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
							}
						} else {
							response.status(401).json({success: false, message: "No authorization header passed."});
						}
					} else {
						response.status(403).json({success: false, message: "Client does not own this post."});
					}
				}
			})
			.catch(error => {
				response.status(401).json({success: false, message: "Invalid credentials supplied."});
			})
		} else {
			response.status(404).json({success: false, message: "Invalid credentials supplied."});
		}
	})
});

module.exports = router;