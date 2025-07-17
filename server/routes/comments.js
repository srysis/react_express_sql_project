const express = require('express');

const database = require('../database.js');

const router = express.Router();

router.get('/:post_id/comments', (request, response) => {
	const requested_post_id = request.params.post_id;

	const select_comments_of_post_query = "SELECT * FROM `comments` WHERE `post_id` = " + requested_post_id;

	database.query(select_comments_of_post_query, (error, data) => {
		if (error) return response.json(error);

		response.json({comments: data});
	})
})

module.exports = router;