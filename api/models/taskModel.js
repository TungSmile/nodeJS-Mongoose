const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), },
    describre: { type: String, default: "" },
    type: { type: String, enum: ['daily', 'onlyOne', 'cyclic'], default: "" },
    status: { type: String, enum: ['new', 'doing', 'finished', 'reNew'], default: "new" }
  },
  { collection: 'task' }
);

module.exports = mongoose.model('task', taskSchema);
