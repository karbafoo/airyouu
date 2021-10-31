const bcrypt = require('bcrypt');
const saltRounds = 10;

const genHash = (s) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(s, salt, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};
const checkPassword = (candidate, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidate, hash, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result == true);
            }
        });
    });
};

module.exports = {
    genHash,
    checkPassword,
};
