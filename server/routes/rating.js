const express = require('express');
const bcrypt = require('bcrypt');

const database = require('../database.js');

const authenticator = require('../middlewares/auth.js');
const checkPostOwner = require('../middlewares/checkPostOwner.js');

const router = express.Router();

router.get('/post/:post_id/get_rating', (request, response) => {
	const post_id = request.params.post_id;

	const select_post_query = "SELECT * FROM `user_posts` WHERE `post_id` = " + post_id;

	database.query(select_post_query, (error, data) => {
		if (error) return response.status(500).json({success: false, message: "Something went wrong."});

		if (!data.length) {
			return response.json({success: false, message: "Post does not exist."})
		}

		const get_rating_query = "SELECT CAST(SUM(`user_posts_ratings`.`like`) AS SIGNED) AS likes_amount, CAST(SUM(`user_posts_ratings`.`dislike`) AS SIGNED) AS dislikes_amount " + 
								 "FROM `users_info` INNER JOIN `user_posts` ON `users_info`.`user_id` = `user_posts`.`post_author` INNER JOIN `user_posts_ratings` ON `user_posts`.`post_id` = `user_posts_ratings`.`post_id` " +
								 "WHERE `user_posts`.`post_id` = '" + post_id + "' GROUP BY `user_posts`.`post_id`";

		database.query(get_rating_query, (error, data) => {
			if (error) return response.status(500).json({success: false, message: "Something went wrong."});

			response.json({success: true, likes: data[0].likes_amount, dislikes: data[0].dislikes_amount});
		})
	})
})

router.get('/post/:post_id/:id/check_if_rated', authenticator, (request, response) => {
	const post_id = request.params.post_id;
	const user_id = request.params.id;

	const check_if_rating_exists_query = "SELECT * FROM forum_db.user_posts_ratings WHERE `post_id` = '" + post_id + "' AND `user_id` = '" + user_id + "'";

	database.query(check_if_rating_exists_query, (error, data) => {
		if (error) return response.status(500).json({success: false, message: "Something went wrong."});

		if (data.length) {
			const check_if_rated_query = "SELECT * FROM forum_db.user_posts_ratings WHERE `post_id` = '" + post_id + "' AND `user_id` = '" + user_id + "'";

			database.query(check_if_rated_query, (error, data) => {
				if (error) return response.status(500).json({success: false, message: "Something went wrong."});

				if (data[0].like == 1) {
					return response.json({liked: true, disliked: false});
				} else if (data[0].dislike == 1) {
					return response.json({liked: false, disliked: true});
				} else {
					return response.json({liked: false, disliked: false});
				}
			})
		} else {
			return response.json({liked: false, disliked: false});
		}
	})
})

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

			if (data.length) {
				if (data[0].dislike == 1 || data[0].like == 0) {
					const update_row_query = "UPDATE `forum_db`.`user_posts_ratings` SET `like` = '1', `dislike` = '0' WHERE (`post_id` = '" + post_id + "') and (`user_id` = '" + user_id + "')";

					database.query(update_row_query, (error, data) => {
						if (error) return response.status(500).json({success: false, message: "Something went wrong."});

						return response.json({success: true, message: "User liked this post."});
					})
				} else if (data[0].like == 1) {
					const update_row_query = "UPDATE `forum_db`.`user_posts_ratings` SET `like` = '0', `dislike` = '0' WHERE (`post_id` = '" + post_id + "') and (`user_id` = '" + user_id + "')";

					database.query(update_row_query, (error, data) => {
						if (error) return response.status(500).json({success: false, message: "Something went wrong."});

						return response.json({success: true, message: "User has already liked this post and hence his like was removed."});
					})
				}
			} else {
				const set_rating_query = "INSERT INTO `forum_db`.`user_posts_ratings` (`post_id`, `user_id`, `like`, `dislike`) VALUES ('" + post_id + "', '" + user_id + "', '1', '0')";

				database.query(set_rating_query, (error, data) => {
					if (error) return response.status(500).json({success: false, message: "Something went wrong."});

					return response.json({success: true, message: "User liked this post."});
				})
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

			if (data.length) {
				if (data[0].like == 1 || data[0].dislike == 0) {
					const update_row_query = "UPDATE `forum_db`.`user_posts_ratings` SET `like` = '0', `dislike` = '1' WHERE (`post_id` = '" + post_id + "') and (`user_id` = '" + user_id + "')";

					database.query(update_row_query, (error, data) => {
						if (error) return response.status(500).json({success: false, message: "Something went wrong."});

						return response.json({success: true, message: "User disliked this post."});
					})
				} else if (data[0].dislike == 1) {
					const update_row_query = "UPDATE `forum_db`.`user_posts_ratings` SET `like` = '0', `dislike` = '0' WHERE (`post_id` = '" + post_id + "') and (`user_id` = '" + user_id + "')";

					database.query(update_row_query, (error, data) => {
						if (error) return response.status(500).json({success: false, message: "Something went wrong."});

						return response.json({success: true, message: "User has already disliked this post and hence his dislike was removed."});
					})
				}
			} else {
				const set_rating_query = "INSERT INTO `forum_db`.`user_posts_ratings` (`post_id`, `user_id`, `like`, `dislike`) VALUES ('" + post_id + "', '" + user_id + "', '0', '1')";

				database.query(set_rating_query, (error, data) => {
					if (error) return response.status(500).json({success: false, message: "Something went wrong."});

					return response.json({success: true, message: "User disliked this post."});
				})
			}
		})
	})
})

module.exports = router;