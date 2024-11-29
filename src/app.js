const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());  

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

module.exports = app;
