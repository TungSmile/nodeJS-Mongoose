const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    ref: { type: String, required: true },
    uid: { type: String, required: true },
    uref: { type: String, required: true },
    money: { type: Number, required: true },
    created_time: { type: Date, default: Date.now, },
})
module.exports = mongoose.model('LogRefSchema', schema);