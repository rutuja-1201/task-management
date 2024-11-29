const express = require('express');
const Task = require('../models/taskModel');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/', protect, async (req, res) => {
    const { title, start_time, end_time, priority } = req.body;
    try {
        const task = await Task.create({
            user: req.user._id,
            title,
            start_time,
            end_time,
            priority,
            status: 'pending',
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (task) res.json(task);
        else res.status(404).json({ message: 'Task not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (task) res.json({ message: 'Task deleted' });
        else res.status(404).json({ message: 'Task not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/dashboard', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === 'finished').length;
        const pendingTasks = totalTasks - completedTasks;

        const completedPercentage = (completedTasks / totalTasks) * 100;
        const pendingPercentage = 100 - completedPercentage;

        let totalTimeSpent = 0;
        let totalTimeRemaining = 0;

        tasks.forEach((task) => {
            const startTime = new Date(task.start_time).getTime();
            const endTime = new Date(task.end_time).getTime();
            const now = Date.now();

            if (task.status === 'finished') {
                totalTimeSpent += (endTime - startTime) / (1000 * 60 * 60);
            } else {
                totalTimeRemaining += Math.max(0, (endTime - now) / (1000 * 60 * 60)); 
            }
        });

        res.json({
            totalTasks,
            completedPercentage,
            pendingPercentage,
            totalTimeSpent,
            totalTimeRemaining,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
