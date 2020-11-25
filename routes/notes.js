const router = require('express').Router()
const Note = require('../models/notes')
const auth = require('./verify-token')


router.get('/login/notes' , auth , async(req , res) => {
    try{
        const notes = await Note.find({userId: res.locals.userId})
        res.send(notes)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login/new' , auth , async(req , res) => {
    const {title, description} = req.body;
    console.log(req.body)
    try{
        const note = new Note({
            userId: res.locals.userId,
            title: title,
            description: description
        })

        const savedNote = await note.save()
        res.send(savedNote) 
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login/:id/edit', auth , async(req , res) => {
    try{
        const newNote = await Note.findById(req.params.id)
        
        if(newNote.userId.toString() === res.locals.userId){
            newNote.title = req.body.title,
            newNote.description = req.body.description

            const savedNewNote = await newNote.save()
            res.send(savedNewNote)
        }else{
            res.sendStatus(403)
        }

    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login/:id/delete', auth , async(req , res) => {
    try{
        const note = await Note.findById(req.params.id)
        if (note.userId.toString() === res.locals.userId) {
            const deletedNote = await note.remove()
            res.send(deletedNote)
        } else {
            res.sendStatus(403)
        }
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router