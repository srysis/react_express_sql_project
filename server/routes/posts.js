const express = require('express');
const jwt = require('jsonwebtoken');

const database = require('../database.js');

const checkPostOwner = require('../middlewares/checkPostOwner.js');

const router = express.Router();

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
							response.json({post: data[0], post_ownership: response.locals.post_ownership})
						} else {
							response.json({message: "Post does not exist or was deleted by it's author.", post: null})
						}
					})

				} else {
					const get_post_by_id_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " +
								 "FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` " +
								 "WHERE `user_posts`.`post_id` = " + requested_post_id;

					database.query(get_post_by_id_query, (error, data) => {
						if (error) return response.json(error);

						if (data.length) {
							response.json({post: data[0], post_ownership: response.locals.post_ownership})
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

router.delete('/post/:post_id/delete', checkPostOwner, (request, response) => {
	const requested_post_id = request.params.post_id;

	if (response.locals.post_ownership) {
		const delete_post_query = "DELETE FROM `user_posts` WHERE `post_id` = " + requested_post_id;

		database.query(delete_post_query, (error, data) => {
			if (error) return response.json(error);

			response.json({success: true, message: "Post was deleted."});
		});
	} else {
		response.status(403).json({success: false, message: "Client does not own this post."});
	}
});

module.exports = router;