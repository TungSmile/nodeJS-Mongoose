const mongoose = require('mongoose');
const UserSchema = mongoose.model('UserSchema');
const LogSignInSchema = mongoose.model('LogSignInSchema');




exports.createLogLogin = async (data) => {
    if (!data && Object.keys(data).length !== 4) {
        return false;
    }
    const logLg = await new LogSignInSchema({ os: data.os ? data.os : "nothing", deviceid: data.deviceid ? data.deviceid : "nothinga", tokenUse: data.tokenUse, idUser: data.idUser }).save();
    if (logLg) { return true; }
    return false;
};


exports.list_all_LogRefSchema = async (req, res) => {
    LogSignInSchema.find()
        .then(list => {
            res.status(200).json({
                msg: "History Refence  ",
                data: list,
                status: true
            });
        })
        .catch(err => {
            res.status(200).send({
                msg: "Have problem ???",
                data: null,
                status: false
            });
        });
};