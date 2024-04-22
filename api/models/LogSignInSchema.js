const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    idUser: { type: String, required: true },
    tokenUse: { type: String, required: true },
    deviceid: { type: String, required: true },
    os: { type: String, required: true },
    created_time: { type: Date, default: Date.now, },
})
module.exports = mongoose.model('LogSignInSchema', schema);