const mysql = require('mysql2');

const database = mysql.createConnection({
	host: 'mysql-13377331-forumdb.c.aivencloud.com',
	port: '19510',
	user: 'avnadmin',
	password: process.env.DATABASE_PASSWORD,
	database: 'forum_db'
});

module.exports = database;