const express = require('express');
const bcrypt = require('bcrypt');

const database = require('../database.js');

const authenticator = require('../middlewares/auth.js');
const checkPostOwner = require('../middlewares/checkPostOwner.js');

const router = express.Router();

router.post('/post/:post_id/:id/like', [authenticator, checkPostOwner], (request, response) => {
	if (response.locals.post_ownership) {
		return response.json({success: false, message: "Post owners cannot affect their own posts' ratings"});
	}

	const post_id = request.params.post_id;

	const user_id = request.params.id;

	const select_post_query = "SELECT * FROM `user_posts` WHERE `post_id` = " + post_id;

	database.query(select_post_query, (error, data) => {
		if (error) return response.status(500).json({success: false, message: "Something went wrong."});

		if (!data.length) {
			return response.json({success: false, message: "Post does not exist."})
		}

		const check_post_rating_query = "SELECT * FROM `user_posts_ratings` WHERE `post_id` = " + post_id + " AND `user_id` = " + user_id;

		database.query(check_post_rating_query, (error, data) => {
			if (error) return response.status(500).json({success: false, message: "Something went wrong."});

			if (data[0].dislike == 1) {
				const update_row_query = "UPDATE `forum_db`.`user_posts_ratings` SET `like` = '1', `dislike` = '0' WHERE (`post_id` = '" + post_id + "') and (`user_id` = '" + user_id + "')";

				database.query(update_row_query, (error, data) => {
					if (error) return response.status(500).json({success: false, message: "Something went wrong."});

					return response.json({success: true, message: "User liked this post."});
				})
			} else if (data[0].like == 1) {
				return response.json({success: true, message: "User has already liked this post."});
			}
		})
	})
})

router.post('/post/:post_id/:id/dislike', [authenticator, checkPostOwner], (request, response) => {
	if (response.locals.post_ownership) {
		return response.json({success: false, message: "Post owners cannot affect their own posts' ratings"});
	}

	const post_id = request.params.post_id;

	const user_id = request.params.id;

	const select_post_query = "SELECT * FROM `user_posts` WHERE `post_id` = " + post_id;

	database.query(select_post_query, (error, data) => {
		if (error) return response.status(500).json({success: false, message: "Something went wrong."});

		if (!data.length) {
			return response.json({success: false, message: "Post does not exist."})
		}

		const check_post_rating_query = "SELECT * FROM `user_posts_ratings` WHERE `post_id` = " + post_id + " AND `user_id` = " + user_id;

		database.query(check_post_rating_query, (error, data) => {
			if (error) return response.status(500).json({success: false, message: "Something went wrong."});

			if (data[0].like == 1) {
				const update_row_query = "UPDATE `forum_db`.`user_posts_ratings` SET `like` = '0', `dislike` = '1' WHERE (`post_id` = '" + post_id + "') and (`user_id` = '" + user_id + "')";

				database.query(update_row_query, (error, data) => {
					if (error) return response.status(500).json({success: false, message: "Something went wrong."});

					return response.json({success: true, message: "User disliked this post."});
				})
			} else if (data[0].dislike == 1) {
				return response.json({success: true, message: "User has already disliked this post."});
			}
		})
	})
})

module.exports = router;