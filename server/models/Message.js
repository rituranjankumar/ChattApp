const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
    
  },
    recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
    
  },
   text:{
    type:String,
   },
   image:{
    type:String,
   },
   seen:{
    type:Boolean,
    default:false,
   } ,
    groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group" // for group chat
  },
 
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model("Message", messageSchema);
