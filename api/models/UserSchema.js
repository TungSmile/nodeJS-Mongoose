const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const aggregate = require('mongoose-aggregate');


const schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    idUser: { type: Number, required: true },
    username: { type: String, default: "NewUser", required: true, unique: true },
    fullname: { type: String, default: "NewUser" },
    password: { type: String, minlength: 6, },
    created_time: { type: Date, default: Date.now, },
    uptime: { type: Date, default: Date.now, },
    gold: { type: Number, min: 0, default: 0 },
    star: { type: Number, min: 0, default: 0 },
    silver: { type: Number, min: 0, default: 0 },
    coin: { type: Number, min: 0, default: 0 },
    loginnum: { type: Number, min: 0, default: 1 },
    openid: { type: Map, of: String },
    token: { type: String, default: "" },
    ref: { type: String, default: "" },
    image: { type: String },
    deviceid: { type: String, default: "" },
    os: { type: String, default: "" },
    status: { type: String, enum: ['active', 'block', 'new_user'], default: 'new_user' }
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        // delete ret.id;
        delete ret.password;
        delete ret.deviceid;
        delete ret.status;
        delete ret.token;
    }
});



module.exports = mongoose.model('UserSchema', schema);