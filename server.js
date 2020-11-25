const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const noteRouter = require('./routes/notes')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ limit: '10mb' , extended: false}))
app.use(express.json())

mongoose.connect(process.env.DB_KEY , {useNewUrlParser: true} , () => {console.log('connected to db...')})

app.use('/' , userRouter)
app.use('/' , noteRouter)

app.listen(3000)