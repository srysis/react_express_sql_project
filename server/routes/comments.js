const express = require('express');

const database = require('../database.js');

const router = express.Router();

router.get('/:post_id/comments', (request, response) => {
	const requested_post_id = request.params.post_id;

	const select_comments_of_post_query = "SELECT `comments`.*, `users_info`.`name` AS `comment_author_name` " + 
										  "FROM `comments` INNER JOIN `users_info` ON `comments`.`comment_author` = `users_info`.`user_id` " + 
										  "INNER JOIN `user_posts` ON `comments`.`post_id` = `user_posts`.`post_id` "
										  "WHERE `user_posts`.`post_id` = " + requested_post_id;

	database.query(select_comments_of_post_query, (error, data) => {
		if (error) return response.json(error);

		response.json({comments: data});
	})
})

module.exports = router;