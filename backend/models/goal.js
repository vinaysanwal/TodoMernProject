const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const goalSchema = new Schema({
  text: String,
  description: String,
});

const GoalModel = mongoose.model("Goal", goalSchema);

module.exports = GoalModel;
