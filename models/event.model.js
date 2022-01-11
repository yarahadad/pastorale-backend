const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    name: String,
    description: String,
    date: String,
    startDate: String,
    endDate: String,
    createdAt: Date
  })
);

module.exports = Event;