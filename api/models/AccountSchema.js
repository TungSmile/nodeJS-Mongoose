const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  _id: {  type: String,  default: () => new mongoose.Types.ObjectId().toString(), },
  username: {
    type: String,
   

  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true,
  //   validate: {
  //     validator: function (email) {
  //       return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
  //         email
  //       );
  //     },
  //     message: "Email không hợp lệ",
  //   },
  // },
  password: {
    type: String,
    // select: false,
    // required: true,
    // minlength: 6,
    // select: false,
  },
  firstName: {
    type: String,
    // required: true,
    // trim: true,
    // maxlength: 50,
    default : '',
  },
  lastName: {
    type: String,
    // required: true,
    // trim: true,
    // maxlength: 50,
    default : '',
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    // default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  mony: {
    type: Number,
    default: 0,
    min: 0,
  },
  openId: {
    type: String,
  },
  ref: {
    type: String,
    default: "",
  },
  listRef: [{
    type: {},
    ref: 'AccountSchema', // Tham chiếu đến chính nó
  }
],
});

module.exports = mongoose.model('AccountSchema', AccountSchema);
