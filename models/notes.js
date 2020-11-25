const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Note' , noteSchema)