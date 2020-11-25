const jwt = require('jsonwebtoken')

function auth (req , res , next){
    const token = req.header('Authorization').split(" ")[1]
    if(!token) return res.status(400).send('access denaid')

    try{
        const verified =  jwt.verify(token , process.env.TOKEN_SECRET)
        res.locals.userId = verified
        next()
    }catch{
        res.status(400).send('invalid token')
    }
}

module.exports = auth