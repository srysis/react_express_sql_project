const express = require('express');
const jwt = require('jsonwebtoken');

const database = require('../database.js');

const authenticator = require('../middlewares/auth.js');

const router = express.Router();

router.get('/:post_id/comments', (request, response) => {
	const requested_post_id = request.params.post_id;

	const select_comments_of_post_query = "SELECT `comments`.*, `users_info`.`name` AS `comment_author_name` " + 
										  "FROM `comments` INNER JOIN `users_info` ON `comments`.`comment_author` = `users_info`.`user_id` " + 
										  "INNER JOIN `user_posts` ON `comments`.`post_id` = `user_posts`.`post_id` " +
										  "WHERE `user_posts`.`post_id` = " + requested_post_id;

	database.query(select_comments_of_post_query, (error, data) => {
		if (error) return response.json(error);

		response.json({comments: data});
	})
});

router.post('/:post_id/comments/add', (request, response) => {
	const token = request.headers['authorization'];
	const requested_post_id = request.params.post_id;
	const user_id = request.body.user_id;
	const comment = request.body.comment;

	if (token) {
		try {
			const decoded_token = jwt.verify(token, jwt_key);

			if (decoded_token.id == user_id) {
				const add_comment_query = "INSERT INTO `comments` (`content`, `post_id`, `comment_author`) VALUES ('" + comment + "', '" + requested_post_id + "', ' " + user_id + "')";

				database.query(add_comment_query, (error, data) => {
					if (error) return response.json(error);

					response.json({success: true, message: "Comment added."});
				})
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
})

module.exports = router;