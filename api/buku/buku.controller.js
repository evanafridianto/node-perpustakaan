const { add, get, getId, update, del } = require("./buku.service");

module.exports = {
    controllerAdd: (req, res) => {
        const buku = {
            kd_buku: req.body.kd_buku,
            nm_buku: req.body.nm_buku,
            pengarang: req.body.pengarang,
            penerbit: req.body.penerbit,
            stok: req.body.stok,
        };
        add(buku, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results,
                    buku,
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
        const body = req.body.kd_buku;
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
        const buku = {
            kd_buku: req.body.kd_buku,
            nm_buku: req.body.nm_buku,
            pengarang: req.body.pengarang,
            penerbit: req.body.penerbit,
            stok: req.body.stok,
        };
        update(buku, (err, results) => {
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
        //     kd_buku: req.body.kd_buku,
        // };
        const body = req.body.kd_buku;
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
};