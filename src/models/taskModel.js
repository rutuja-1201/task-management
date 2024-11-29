const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    priority: { type: Number, required: true, min: 1, max: 5 },
    status: { type: String, required: true, enum: ['pending', 'finished'] },
});

module.exports = mongoose.model('Task', taskSchema);
