const router = require('express').Router()
const User = require('../models/users')
const { check, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

router.post('/', [
    // username must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
   ] , async(req , res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        //Chicking if the email is exist
        const emailExist = await User.findOne({email: req.body.email})
        if(emailExist) return res.send('email is exist')

        // hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassord = await bcrypt.hash(req.body.password , salt)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassord
        })
        try{
            const savedUser = await user.save()
            res.send(savedUser)
        }catch(e){
            res.status(400).send(e)
        }
})

router.post('/login' , async (req , res) => {
    try{
        // Chicking if the email is exist
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.send('email is not found')
        // Chicking if the password is exist
        console.log(req.body.password, user.password)
        const validPass = await bcrypt.compare(req.body.password, user.password)
        if(!validPass) return res.status(400).send('password is wrong')
        //create and assign a tocken
        const token = jwt.sign({_id: user._id} , process.env.TOKEN_SECRET)
        res.header('auth-token' , token)

        res.send({user , token})
    }catch{
        res.status(400).send()
    }
})

module.exports = router