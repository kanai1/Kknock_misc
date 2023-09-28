require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('./util/jwt_utils')
const connection = require('./util/DB')
const axios = require('axios')
const crypto = require('crypto');

const app = express()
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('views', './public');

app.get('/', jwt.verify, (req, res) => {
	let flag = "THIS IS NOT FLAG"

	if(req.jwt.isLogin){
		if(req.jwt.idx=="admin") flag = process.env.FLAG
		res.render('index', {isLogin: req.jwt.isLogin, name: req.jwt.idx, flag: flag})
	}
	else{
		res.render('index', {isLogin: req.jwt.isLogin, name: 'Anonymous', flag: flag})
	}
})

app.get('/login', (req, res) => {res.render('login')})
app.post('/login', async (req, res) => {
	const host = req.get('HOST') // localhost:8888
	const id = req.body.id
	const password = req.body.password
	const url = `http://${host}/password/${id}`

	const resp = await axios.get(url)

	if(resp.data == "User Does Not Exist") {
		res.write("<script>alert('please register')</script>")
		res.write("<script>window.location='/register'</script>")
		return res.send()
	}
	else if(resp.data == "500 Error") 
	{
		res.send("SomeThind Error")
	}
	else if(resp.data == crypto.createHash('SHA256').update(password).digest('hex')) {
		const token = jwt.genarateAccessToken(id)
		res.cookie('token', token)
		res.redirect('/')
	}
	else {
		res.write("<script>alert('Incorrect Id or Password')</script>")
		res.write("<script>window.location='/login'</script>")
		res.send()
		return res.send()
	}
	
})
app.get('/password/:id', (req, res) => {
	const sql = "SELECT password FROM login WHERE id = ?"
	const values = [req.params.id]

	connection.query(sql, values, (err, rows) => {
		if(err) {
			return res.send("500 Error")
		}
		else if(rows.length > 0) {
			return res.send(rows[0]['password'])
		}
		else {
			return res.send("User Does Not Exist")
		}
	})
	
})
app.get('/register', (req, res) => {res.render('register')})
app.post('/register', (req, res) => {
	const id = req.body.id
	const password = req.body.password

	const select_sql = "SELECT * FROM login WHERE id = ?"
	const select_values = [id]

	const insert_sql = "INSERT INTO login(id, password) VALUES(?, ?)"
	const insert_values = [id, password]

	connection.query(select_sql, select_values, (err, log) => {
		if(err) return next(err)

	})

	connection.query(insert_sql, insert_values, (err, log) => {
		if(err) return next(err)
		else {
		
		}
	})
})
app.get('/logout', (req, res) => {res.clearCookie('token'); res.redirect('/')})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send("SomeThing Error");
})

app.listen(process.env.PORT);