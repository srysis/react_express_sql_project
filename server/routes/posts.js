const express = require('express');
const jwt = require('jsonwebtoken');

const database = require('../database.js')

const router = express.Router();

router.get('/posts', (request, response) => {
	const get_all_posts_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " +
								"FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` ORDER BY `user_posts`.`post_date` DESC;"

	database.query(get_all_posts_query, (error, data) => {
		if (error) return response.json(error);

		response.json({posts: data});
	})
});

router.get('/post/:post_id', (request, response) => {
	const requested_post_id = request.params.post_id;

	const get_post_by_id_query = "SELECT `users_info`.`name` AS `post_author_name`, `user_posts`.`post_id`, `user_posts`.`post_title`, `user_posts`.`post_content`, `user_posts`.`post_date`, `user_posts`.`post_author` " +
								 "FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` " +
								 "WHERE `user_posts`.`post_id` = " + requested_post_id;

	database.query(get_post_by_id_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			response.json({post: data[0]})
		} else {
			response.json({message: "Post does not exist or was deleted by it's author.", post: null})
		}
	})
});

module.exports = router;