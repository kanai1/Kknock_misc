require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(express.json())
app.use('/static', express.static('public'));

app.use('/', (req, res) => {res.render('index')})
app.listen(process.env.PORT);