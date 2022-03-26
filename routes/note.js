
const express = require('express');
const router = express.Router();

const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes/:id',async (req, res) => {
    try {
        const notes = await Note.find({ user: req.params.id}).sort({createdAt:-1})
        .populate("user"," -password")
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote',
 async (req, res) => {
        try {

            const { title, description,userId } = req.body;
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, user:userId
                
            })
            const savedNote = await note.save()

            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).json("Internal Server Error");
        }
    })
    
// ROUTE 3: Update an existing Note using: POST "/api/notes/updatenote". Login required
router.put('/updatenote/:id', async (req, res) => {
    const {title, description} = req.body;
    try {
        const newNote  = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
 

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).json("Not Found")}

    if(note.user.toString() !== req.body.userId){
        return res.status(401).json("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }
   
    
    
    })
    // ROUTE 4p: Delete an existing Note using: POST "/api/notes/deletenote". Login required
router.delete('/deletenote/:id',async(req, res) => {
    try {

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).json("Not Found")}
   await Note.findByIdAndDelete(req.params.id)
    
    res.json("success: note deleted");

    }catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }
  
    
})

// ROUTE 5: Get particular notes POST "/api/notes/updatenote". Login required
router.get('/getNote/:id', async (req, res) => {
    
    try {


    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).json("Not Found")}
    res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }

    
    
    })

module.exports = router