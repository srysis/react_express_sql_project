const mysql = require('mysql');

const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'forum_db'
});

module.exports = database;