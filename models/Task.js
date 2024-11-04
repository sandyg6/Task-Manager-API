const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' },
    dueDate: Date
});

module.exports = mongoose.model('Task', taskSchema);
