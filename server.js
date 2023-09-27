require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'));
app.set('views', './public');

app.use('/', (req, res) => {res.render('index')})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send("SomeThing Error");
})

app.listen(process.env.PORT);