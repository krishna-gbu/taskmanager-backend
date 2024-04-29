const Task = require("../models/Task");

// Get all tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    next(err);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      throw new Error("Task not found");
    }
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      throw new Error("Task not found");
    }
    res.json({ message: "Deleted Task" });
  } catch (err) {
    next(err);
  }
};
