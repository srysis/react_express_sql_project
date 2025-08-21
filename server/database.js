const mysql = require('mysql2');
const dot_env = require('dotenv');

dot_env.config();

const database = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: 'forum_db'
});

database.connect((error) => {
	if (error) throw error;
})

module.exports = database;