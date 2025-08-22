// models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

module.exports = mongoose.model("Group", groupSchema);
