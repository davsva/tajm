const mongoose = require('mongoose');

const Note = mongoose.model('Note', { description: String });

exports.Note = Note;



