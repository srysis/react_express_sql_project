const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const dot_env = require('dotenv');

const database = require('./database.js');

const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const postsRoutes = require('./routes/posts.js');
const commentsRoutes = require('./routes/comments.js');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.static("./public"));
app.use(cookieparser());

dot_env.config();

global.port = process.env.PORT;
global.access_key = process.env.ACCESS_KEY;
global.refresh_key = process.env.REFRESH_KEY;


app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

app.use('/api/', postsRoutes);

app.use('/api/post', commentsRoutes);

// root
app.get('/', (request, response) => {
	response.json(`API is running. Awaiting instructions...`);
});

app.get('/api/search', (request, response) => {
	const search_queue = request.query.queue;

	if (search_queue) {
		const sql_query = "SELECT * FROM `users_info` WHERE `name` LIKE '%" + search_queue + "%'"

		database.query(sql_query, (error, data) => {
			if (error) return response.json(error);

			if (data.length) { 
				response.json({results: data}) 
			} else {
				response.json({results: []});
			}
		})
	} else {
		response.json({results: []});
	}
})

app.listen(process.env.PORT || port, () => {console.log(`server runs on port ${port}`)});