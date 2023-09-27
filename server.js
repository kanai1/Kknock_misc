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

	console.log(resp.data)
	if(resp.data == "User Does Not Exist") {
		res.write("<script>alert('please register')</script>")
		res.write("<script>window.location='/register'</script>")
		return res.send()
	}
	if(resp.data == crypto.createHash('SHA256').update(password).digest('hex')) {
		// 로그인 성공
	}
	else {
		//로그인 실패
	}
	
})
app.get('/password/:id', (req, res) => {
	const sql = "SELECT password FROM login WHERE id = ?"
	const values = [req.params.id]

	connection.query(sql, values, (err, rows) => {
		if(err) {
			res.send(err)
		}
		if(rows.length > 0) {
			res.send(rows[0]['password'])
		}
		else {
			res.send("User Does Not Exist")
		}
	})
	
})
app.get('/register', (req, res) => {res.render('register')})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send("SomeThing Error");
})

app.listen(process.env.PORT);