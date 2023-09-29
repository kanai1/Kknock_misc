require('dotenv').config();
const mysql = require('mysql2');
const waitPort = require('wait-port')

const connection = mysql.createPool({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME,
	waitForConnections: true,
  	connectionLimit: 10,
});


// (async () => {
// 	await waitPort({ host: process.env.DB_HOST, port: 3306 });
// 	console.log('MySQL server is ready, connecting...');

// 	connection.connect((err) => {
// 		if (err) {
// 			console.error('Database connection error: ', err);
// 		} else {
// 		  console.log('Connected to the database');
// 		}
// 	});
// })()

module.exports = connection.promise()