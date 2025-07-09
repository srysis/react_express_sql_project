const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dot_env = require('dotenv');

const authenticator = require('./middlewares/auth');

const database = require('./database.js');

const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const postsRoutes = require('./routes/posts.js');

const app = express();
app.use(express.json());
app.use(cors());

dot_env.config();

global.port = process.env.PORT;
global.jwt_key = process.env.SECRET_KEY;


// import endpoints related to 'logging in' and 'registration'
app.use('/', authRoutes);

// import user-related endpoints
app.use('/user', userRoutes);

// import posts-related endpoints
app.use('/', postsRoutes);

// root
app.get('/', (request, response) => {
	response.json(`This is a root of localhost on port ${port}.`);
});

app.get('/search/:queue', (request, response) => {
	const search_queue = request.params.queue;

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

app.listen(port, () => {console.log(`server runs on port ${port}`)});