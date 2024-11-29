const { getTasksByUser, createTask, updateTask, deleteTask } = require('../models/taskModel');

const getTasks = async (req, res) => {
    const userId = req.user.id;
    const { priority, status, sort } = req.query;
    const filters = { priority, status };

    const tasks = await getTasksByUser(userId, filters, sort);
    res.json(tasks);
};

const create = async (req, res) => {
    const userId = req.user.id;
    await createTask(userId, req.body);
    res.status(201).json({ message: 'Task created' });
};

const update = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    console.log("userid",req.user)

    const success = await updateTask(taskId, userId, req.body);
    if (!success) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task updated' });
};

const remove = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    const success = await deleteTask(taskId, userId);
    if (!success) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
};

module.exports = { getTasks, create, update, remove };
