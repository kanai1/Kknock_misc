require('dotenv').config()
const jwt = require('jsonwebtoken')

let jwt_utils = {
	genarateAccessToken : (id, name) => {
	return jwt.sign({
			idx: id,
		},
			process.env.JWT_SECRET_CODE,
			{
			algorithm : "HS256", // 해싱 알고리즘
			expiresIn : "20m",  // 토큰 유효 기간
			issuer : "ksh30918" // 발행자
		})
	},

	verify: function(req, res, next) {
		if(!req.cookies.token) {
			req.jwt = {isLogin: false}
			console.log('no token', req.jwt)
			return next();
		}
		else {
			token = req.cookies.token
			jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decoded) => {
				if(err){
					return next(err)
				}
				else{
					req.jwt = decoded
					req.jwt.isLogin = true
					return next()
				}
			})
		}
	}
}

module.exports = jwt_utils;