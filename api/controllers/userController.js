const mongoose = require('mongoose');
const UserSchema = mongoose.model('UserSchema');
const LogRefSchema = mongoose.model('LogRefSchema');
const LogSignIn = require('./logLoginController');
const bcrypt = require('bcrypt');
const cryptoCus = require('../help/cryptoService');
const regex = require('../help/regex')
const social = ["Telegram", "Facebook", "Google"];
const jwt = require('jsonwebtoken')
const SECRET = '12456';


//c
exports.create_a_UserWithRef = async (req, res) => {
    try {
        const data = req.body;
        const idU = await UserSchema.countDocuments();
        if (await UserSchema.findOne({ username: data.username })) {
            return res.status(400).json({
                msg: `Username ${data.username} is already taken`,
                status: false
            });
        }
        const UserRef = await UserSchema.findOne({ ref: data.ref })
        if (Object.keys(data).length === 3 && UserRef) {
            const hashRef = bcrypt.hashSync(data.username, 5);
            const newPass = bcrypt.hashSync(data.password, 5);
            const newUser = await new UserSchema({ idUser: idU, username: data.username, password: newPass, ref: hashRef }).save();
            const newLog = await new LogRefSchema({ ref: hashRef, uid: data.username, uref: UserRef.username, money: 500 }).save();
            UserRef.gold += 500;
            UserRef.save();
            let payload = { id: newUser._id, username: newUser.username }
            return await res.status(201).json({
                token: jwt.sign(payload, SECRET, {
                    expiresIn: 36000 * 10 * 100
                }),
                msg: "Register Done ",
                status: true
            });
        }
        return res.status(400).json({
            user: null,
            msg: "Wrong api / code referencer",
            status: false
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            user: null,
            msg: "Unknow",
            status: false
        });
    }
};
exports.create_a_User_by_openID = async (req, res) => {
    try {
        const data = req.body;
        // data {typeS, link }
        if (Object.keys(data).length !== 2) {
            return res.status(400).send({
                msg: "Please check type data",
                status: false
            });
        }
        const user = null;
        const idU = await UserSchema.countDocuments();
        const name = "NewUser " + idU;
        const hashRef = bcrypt.hashSync(data.link, 5);
        const newUser = await new UserSchema({
            idUser: idU,
            username: name,
            openid: {}
            , ref: hashRef
        });

        switch (data.typeS) {
            case "Telegram":
                user = await UserSchema.findOne({ 'openid.Telegram': data.link });
                if (user) {
                    let payload = { id: user._id }
                    return await res.status(200).send({
                        token: jwt.sign(payload, SECRET, {
                            expiresIn: 36000 * 10 * 100
                        }),
                        msg: "Login done by " + data.typeS,
                        status: true
                    });
                }
                newUser.openid.set('Telegram', data.link);
                break;
            case "Facebook":
                user = await UserSchema.findOne({ 'openid.Facebook': data.link });
                if (user) {
                    let payload = { id: user._id }
                    return await res.status(200).send({
                        token: jwt.sign(payload, SECRET, {
                            expiresIn: 36000 * 10 * 100
                        }),
                        msg: "Login done by " + data.typeS,
                        status: true
                    });
                }
                newUser.openid.set('Facebook', data.link);
                break;
            case "Google":
                user = await UserSchema.findOne({ 'openid.Google': data.link });
                if (user) {
                    let payload = { id: user._id }
                    return await res.status(200).send({
                        token: jwt.sign(payload, SECRET, {
                            expiresIn: 36000 * 10 * 100
                        }),
                        msg: "Login done by " + data.typeS,
                        status: true
                    });
                }
                newUser.openid.set('Google', data.link);
                break;
            default:
                return res.status(400).send({
                    msg: "Dont have type social",
                    status: false
                });

        }
        newUser.save();
        let payload = { id: newUser._id }
        return await res.status(200).json({
            token: jwt.sign(payload, SECRET, {
                expiresIn: 36000 * 10 * 100
            }),
            msg: "Register Done ",
            status: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Have Problem",
            status: false
        });
    }
}
// thêm type như web , os
exports.create_a_User = async (req, res) => {
    try {
        const data = req.body;
        const idU = await UserSchema.countDocuments();



        if (await UserSchema.findOne({ username: data.username })) {
            return res.status(400).json({
                msg: `Username ${data.username} is already taken`,
                status: false
            });
        }
        if (!regex.checkUserName(data.username) || !regex.checkPassword(data.password)) {
            return res.status(400).json({
                msg: "Wrong Username or Password",
                status: false
            });
        }
        if (Object.keys(data).length === 2) {
            const hashRef = "r-" + (await cryptoCus.Encrypt(data.username)).toString()
            const newPass = (await cryptoCus.Encrypt(data.password)).toString()
            const newUser = await new UserSchema({ idUser: idU, username: data.username, password: newPass, ref: hashRef }).save();
            let payload = { id: newUser._id, username: newUser.username }
            return await res.status(200).json({
                token: jwt.sign(payload, SECRET, {
                    expiresIn: 36000 * 10 * 100
                }),
                msg: "Register Done ",
                status: true
            });
        }
        return res.status(400).json({
            user: null,
            msg: "Wrong api / type data",
            status: false
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            user: null,
            msg: "Unkwon",
            status: false
        });
    }
};
//r
exports.loginAndRegister = async (req, res) => {
    try {
        const data = req.body;
        var user = null;
        if (data.username) { user = await UserSchema.findOne({ username: data.username }); }
        if (user) {
            if (cryptoCus.Compare(data.password, user.password)) {
                if (data.wallet) user.token = data.wallet
                user.loginnum += 1;
                await user.save();
                let payload = { id: user._id };
                let tk = jwt.sign(payload, SECRET, { expiresIn: 36000 * 10 * 100 });
                LogSignIn.createLogLogin({ os: data.os, deviceid: data.deviceid, tokenUse: tk, idUser: user._id });
                return res.status(200).json({
                    dataUser: user.toJSON(),
                    msg: "Login Success",
                    token: tk,
                    status: true
                });
            }
            return res.status(400).json({
                msg: "Wrong Username or Password",
                status: false
            });
        }
        if (regex.checkUserName(data.username) && regex.checkPassword(data.password)) {
            const idU = await UserSchema.countDocuments();
            const hashRef = (await cryptoCus.Encrypt(data.username)).toString();
            const newPass = (await cryptoCus.Encrypt(data.password)).toString();
            const newUser = await new UserSchema({ idUser: idU, username: data.username, fullname: data.username, password: newPass, ref: hashRef })
            if (data.wallet) newUser.token = data.wallet
            newUser.save();
            let payload = { id: newUser._id, username: newUser.username }
            return await res.status(201).json({
                dataUser: newUser.toJSON(),
                msg: "Register Done ",
                token: jwt.sign(payload, SECRET, {
                    expiresIn: 36000 * 10 * 100
                }),
                status: true
            });
        }
        return await res.status(400).json({
            msg: "User name /Pass word has 6-10 characters including numbers and letters ",
            status: false
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Some thing wrong",
            status: false
        });
    }
}
exports.login = async (req, res) => {
    try {
        const data = req.body;
        var user = null;
        if (data.username) { user = await UserSchema.findOne({ username: data.username }); }
        if (user) {
            if (cryptoCus.Compare(data.password, user.password)) {
                if (data.wallet) user.token = data.wallet
                user.loginnum += 1;
                await user.save();
                let payload = { id: user._id };
                let tk = jwt.sign(payload, SECRET, { expiresIn: 36000 * 10 * 100 });
                LogSignIn.createLogLogin({ os: data.os, deviceid: data.deviceid, tokenUse: tk, idUser: user._id });
                return res.status(200).json({
                    dataUser: user.toJSON(),
                    msg: "Login Success",
                    token: tk,
                    status: true
                });
            }
            return res.status(400).json({
                msg: "Wrong  Password",
                status: false
            });
        }
        return res.status(400).json({
            msg: "Wrong  Username",
            status: false
        });

    } catch (error) {
        console.log(err);
        return res.status(500).send({
            msg: "Some thing wrong",
            status: false
        });
    }
}
exports.list_all_UserSchema = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            msg: "Author",
            status: false
        });
    }
    UserSchema.find()
        .then(list => {
            return res.status(200).json({
                msg: "All list user",
                data: list,
                status: true
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(200).send({
                msg: "Have problem ???",
                data: null,
                status: false
            });
        });
};
exports.getUserById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                msg: "Author",
                status: false
            });
        }
        const data = req.user

        const user = await UserSchema.findById(data.id);
        if (!user) {
            return res.status(400).json({
                msg: "Wrong IdUserName",
                status: false
            });
        }
        return res.status(200).json({
            msg: "Get Infomation User Success",
            user: user,
            status: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Have Problem",
            status: false
        });
    }
};

//u
exports.update_res_User = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                msg: "Author",
                status: false
            });
        }
        const data = req.body;
        // data{from, to,value}
        const data1 = req.params
        const user = await UserSchema.findById(data.to);
        if (!user) {
            return res.status(400).json({
                msg: "Wrong Id user",
                status: false
            });
        }
        // if (user.user_id === req.user.id) {
        //     // ??? logic , fix lại sau
        //     return res.status(400).json({
        //         msg: "Are u cheat",
        //         status: false
        //     });
        // }
        var value = parseInt(data.value);
        if (!(typeof value === "number") || isNaN(value)) {
            return res.status(400).json({
                msg: "Value is !number",
                status: false
            });
        }

        switch (data1.rs + "") {
            case "updateGold":
                user.gold += value;
                if (user.gold < 0) {
                    return res.status(400).json({
                        msg: "Your Gold not enough",
                        status: false
                    });
                }
                user.save();
                break;
            case "updateStart":
                user.start += value;
                if (user.start < 0) {
                    return res.status(400).json({
                        msg: "Your Start not enough",
                        status: false
                    });
                }
                user.save();
                break;
            case "updateSilver":
                user.silver += value;
                if (user.silver < 0) {
                    return res.status(400).json({
                        msg: "Your Silver not enough",
                        status: false
                    });
                }
                user.save();
                break;
            case "updateCoin":
                user.coin += value;
                if (user.coin < 0) {
                    return res.status(400).json({
                        msg: "Your Coin not enough",
                        status: false
                    });
                }
                user.save();
                break;
            default:
                return res.status(500).json({
                    msg: "What change something ? ",
                    status: false
                });
        }
        return res.status(200).json({
            user: user,
            msg: "Done ",
            status: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Unknow",
            status: false
        });
    }


}

//d
exports.test = async (req, res) => {
    try {
        const data = req.body;
        const en = await cryptoCus.Encrypt(data.msg);
        return res.status(200).json({
            data: data.msg,
            encode: en

        })
    } catch (error) {
        console.log(error);
    }
}
exports.test1 = async (req, res) => {
    try {
        const data = req.body;
        req.headers.authorization.split(' ')[1];
        const de = await cryptoCus.Decrypt(data.msg);
        return res.status(200).json({
            data: data.msg,
            decode: de

        })
    } catch (error) {
        console.log(error);
    }
}