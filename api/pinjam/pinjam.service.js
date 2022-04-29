const db = require("../../config/connection");
module.exports = {
    add: (data, callBack) => {
        db.query(
            `select * from buku where kd_buku = ?`, [data.kd_buku],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } else if (!results[0]) {
                    return callBack("BNF");
                } else if (results[0].stok < 1) {
                    return callBack("Habis");
                } else {
                    db.query(
                        `select kd_anggota from anggota where kd_anggota = ?`, [data.kd_anggota],
                        (err, results) => {
                            if (err) {
                                console.log(err);
                                return;
                            } else if (!results[0]) {
                                return callBack("ANF");
                            } else {
                                db.query(
                                    `select kd_petugas from petugas where kd_petugas = ?`, [data.kd_petugas],
                                    (err, results) => {
                                        if (err) {
                                            console.log(err);
                                            return;
                                        } else if (!results[0]) {
                                            return callBack("PNF");
                                        } else {
                                            db.query(
                                                `insert into pinjam set ?`, [data],
                                                (err, results) => {
                                                    if (err) {
                                                        return callBack(err);
                                                    } else {
                                                        db.query(
                                                            `select * from buku where kd_buku = ?`, [data.kd_buku],
                                                            (err, results) => {
                                                                if (err) {
                                                                    console.log(err);
                                                                    return;
                                                                } else {
                                                                    hasil = results[0].stok - 1;
                                                                    db.query(
                                                                        `update buku set stok=? where
kd_buku = ?`, [hasil, data.kd_buku]
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }
                                                    return callBack(null, results);
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    },
    get: (callBack) => {
        db.query(`select * from pinjam`, [], (err, results) => {
            if (err) {
                return callBack(err);
            } else {
                return callBack(null, results[0]);
            }
        });
    },
    getId: (data, callBack) => {
        db.query(
            `select * from pinjam where no_pinjam = ?`, [data],
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else {
                    return callBack(null, results[0]);
                }
            }
        );
    },
    update: (data, callBack) => {
        db.query(
            `select * from pinjam where no_pinjam=?`, [data.no_pinjam],
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else {
                    db.query(`update pinjam set ? where no_pinjam = ?`, [
                        data,
                        data.no_pinjam,
                    ]);
                    return callBack(null, results[0]);
                }
            }
        );
    },
    del: (data, callBack) => {
        db.query(
            `select no_pinjam from pinjam where no_pinjam = ?`, [data.no_pinjam],
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else {
                    db.query(
                        `delete from pinjam where no_pinjam = ?`, [data.no_pinjam],
                        (err, result) => {
                            if (err) {
                                return callBack(err);
                            } else {
                                db.query(
                                    `select * from buku where kd_buku = ?`, [data.kd_buku],
                                    (err, results) => {
                                        if (err) {
                                            console.log(err);
                                            return callBack(err);
                                        } else {
                                            hasil = results[0].stok + 1;
                                            db.query(
                                                `update buku set stok=? where kd_buku =
                                                                                    ?`, [hasil, data.kd_buku]
                                            );
                                        }
                                    }
                                );
                                return callBack(null, result[0]);
                            }
                        }
                    );
                }
            }
        );
    },
};