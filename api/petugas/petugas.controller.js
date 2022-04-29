const {
    add,
    get,
    getId,
    update,
    del,
    serviceGetUserByEmail,
} = require("./petugas.service");

const { genSaltSync, hashSync, compareSync } = require("bcryptjs");

const { sign } = require("jsonwebtoken");

module.exports = {
    controllerAdd: (req, res) => {
        const petugas = {
            kd_petugas: req.body.kd_petugas,
            nm_petugas: req.body.nm_petugas,
            jabatan: req.body.jabatan,
            telp: req.body.telp,
            email: req.body.email,
            password: req.body.password,
        };
        const salt = genSaltSync(10);
        petugas.password = hashSync(petugas.password, salt);
        add(petugas, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results,
                    petugas,
                });
            }
        });
    },

    controllerGet: (req, res) => {
        get((err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                return res.json({
                    success: 1,
                    data: results,
                });
            }
        });
    },
    controllerGetId: (req, res) => {
        const body = req.body.kd_petugas;
        getId(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                return res.json({
                    success: 1,
                    data: results,
                });
            }
        });
    },

    controllerUpdate: (req, res) => {
        const petugas = {
            kd_petugas: req.body.kd_petugas,
            nm_petugas: req.body.nm_petugas,
            jabatan: req.body.jabatan,
            telp: req.body.telp,
        };
        update(petugas, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else if (!results) {
                return res.json({
                    success: 0,
                    message: "Not Found",
                });
            } else {
                return res.json({
                    success: 1,
                    data: results,
                });
            }
        });
    },
    controllerDelete: (req, res) => {
        // const body = {
        //     kd_petugas: req.body.kd_petugas,
        // };
        const body = req.body.kd_petugas;
        del(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else if (!results) {
                return res.json({
                    success: 0,
                    message: "Not Found",
                });
            } else {
                return res.json({
                    success: 1,
                    message: "Delete Success",
                });
            }
        });
    },

    controllerLogin: (req, res) => {
        const body = req.body;
        serviceGetUserByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Invalid Email",
                });
            }

            const result = compareSync(body.password, results.password);
            // console.log(result);
            // console.log(results.password);
            // console.log(body.password);

            if (result) {
                results.password = undefined;
                const jsonwebtoken = sign({ result: results }, "secretkey", {
                    expiresIn: "1h",
                });
                return res.json({
                    success: 1,
                    message: "Login succesfuly, Your Account Already Use",
                    account: results,
                    token: jsonwebtoken,
                });
            } else {
                return res.json({
                    success: 0,
                    message: "Password Invalid",
                });
            }
        });
    },
};