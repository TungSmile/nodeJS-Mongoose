const mongoose = require('mongoose');
const UserSchema = mongoose.model('UserSchema');
const LogRefSchema = mongoose.model('LogRefSchema');
const cryptoCus = require('../help/cryptoService');
const bcrypt = require('bcrypt');
let valueCode = require('../help/value')

// r
exports.list_all_LogRefSchema = async (req, res) => {
    LogRefSchema.find()
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
//c
exports.add_ref_after = async (req, res) => {
    try {
        const data = req.body;
        if (req.user === undefined) {
            return res.status(401).json({
                msg: "Author",
                status: false
            });
        }
        //{user name , pass , ref}
        const auth = await UserSchema.findOne({ _id: req.user.id });
        const give = await UserSchema.findOne({ ref: data.ref });
        if (!give || !auth || give.username === auth.username) {
            return res.status(400).json({
                msg: "Refence code used incorrectly",
                status: false
            });
        }
        const onlyOne = await LogRefSchema.findOne({ uid: give.username })
        if (onlyOne) {
            return res.status(400).json({
                msg: "Refence code used only one",
                status: false
            });
        }
        const LogRef = await new LogRefSchema({ ref: data.ref, uid: give.username, uref: auth.username, money: valueCode.value_Refence }).save();
        give.gold += valueCode.value_Refence;
        give.save();
        return res.status(201).json({
            msg: "Get refence code complete",
            status: true
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json(err);
        // Handle errors
    }
};