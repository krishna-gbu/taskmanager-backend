const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  date: String,
  status: {
    type: String,
    enum: ["pending", "complete"],
    default: "pending",
  },
  notes: String,
});

module.exports = mongoose.model("Task", TaskSchema);
