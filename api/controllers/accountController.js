const mongoose = require('mongoose');
const AccountSchema = mongoose.model('AccountSchema');

exports.list_all_AccountSchemas = async (req, res) => {
    AccountSchema.find()
        .then(AccountSchemas => {
            res.status(200).json(AccountSchemas);
            console.log("AccountSchema", AccountSchemas);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching users');
        });
};
exports.login = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await AccountSchema.findById(id);
        if (!account) {
            const savedAccount = await new AccountSchema(req.body);
            savedAccount._id = id;
            console.log("Saved>>>>>", savedAccount);
            savedAccount.save();
            return res.status(201).json(savedAccount);
        }

        res.status(200).json(account);
    } catch (err) {

        console.error(err);
        res.status(500).send('Lỗi lấy account');
    }
};
exports.getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id ......", id);
        const account = await AccountSchema.findById(id, { select: 'password' });
        console.log("Account.....", account);
        if (!account) {
            return res.status(400).json("account null");
        }
        res.status(200).json(account);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi lấy account');
    }
};
exports.ref = async (req, res) => {
    try {
        const { id, ref } = req.body;
        const account = await AccountSchema.findById(id);
        if (!account) return res.status(400).json("không tìm thấy id");

        if (account.ref === "") {
            const accountOld = await AccountSchema.findById(ref);
            if (accountOld) {
                account.ref = ref;
                /// cộng tiền cho tài khoản nhập
                account.mony += 500;
                let acc = {};
                acc.id = id;
                acc.firstName = account.firstName;
                acc.lastName = account.lastName;
                accountOld.listRef.push(acc);
                /// cộng tiền cho tài khoản mời
                accountOld.mony += 2000;
                await account.save();
                await accountOld.save();
                return res.status(200).json(accountOld);
            }
            return res.status(200).json("account");
        }
        return res.status(400).json("tài khoản đã nhập ref");
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Lỗi  ref');
    }
};
exports.create_a_Account = async (req, res) => {
    try {
        const savedAccount = await new AccountSchema(req.body).save();
        res.status(201).json(savedAccount);
    } catch (err) {
        res.status(400).json(err);
        // Handle errors
    }
};
exports.read_a_AccountSchema = (req, res) => {
    AccountSchema.findById(req.params.AccountSchemaId, (err, AccountSchema) => {
        if (err) res.status(400).json(err);
        res.status(201).json(AccountSchema);
    });
};
exports.update_a_AccountSchema = (req, res) => {
    AccountSchema.findOneAndUpdate(
        { _id: req.params.AccountSchemaId },
        req.body,
        { new: true },
        (err, AccountSchema) => {
            if (err) res.status(400).json(err);
            res.status(201).json(AccountSchema);
        }
    );
};
exports.update_a_AccountSchemaMony = (req, res) => {
    AccountSchema.findOneAndUpdate(
        { _id: req.params.AccountSchemaId },
        req.body,
        { new: true },
        (err, AccountSchema) => {
            if (err) res.status(400).json(err);
            res.status(201).json(AccountSchema);
        }
    );
};
exports.delete_a_AccountSchema = (req, res) => {
    AccountSchema.deleteOne({ _id: req.params.AccountSchemaId }, err => {
        if (err) res.status(400).json(err);
        res.status(201).json({
            message: 'AccountSchema successfully deleted',
            _id: req.params.AccountSchemaId
        });
    });
};
