require('dotenv').config();

console.log(process.env.MONGO_URI);


const mongoose = require('mongoose');
const Note = require('./models/Note');

const express = require('express');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());


app.get('/api/notes', async (req, res) => {
  try { 
    const notes = await Note.find();
  res.json(notes);
} catch (err){
  res.status(500).json({error: 'Failed to fetch notes'});
}
});

  app.post('/api/notes', async (req, res) => {
    try {
    const newNote = new Note ({
      // id: Date.now(),
      title: req.body.title,
      content: req.body.content
    });

    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note'});
  }
  });

  app.delete('/api/notes/:id', async (req, res) => {
    try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if(!deletedNote) {
      return res.status(404).json({ message: "Note not found"});
    }

    res.json({message: "Note deleted successfully"});
  } catch (errr) {
    res.status(500).json({ error: "Failed to delete note"});
  }
  });

  app.put('/api/notes/:id', async (req, res ) => {
    try {
      const { title, content } = req.body;

      if(!title || !content ) {
        return res.status(400).json({error: "Title and content required"})
      }
    
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, 
     {title, content},
     {new: true }
  );

  if(!updatedNote){
    return res.status(404).json({message: "Note not found"});
  }
    res.json(updatedNote);
  } catch(errr){
    res.status(500).json({error: "Failed to update note"});
  }
  });

  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});