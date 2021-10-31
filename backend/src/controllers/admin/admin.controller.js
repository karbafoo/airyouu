const Admin = require('./admin.model');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const ERRORS = require('../../util/ERRORS.json');
const {validateEmail} = require('../../util/validator');
const {genHash, checkPassword} = require('../../util/hasher');

const makeAdmin = ({email, name, password} = {}) => {
    return new Promise(async (resolve, reject) => {
        const [emailValid, validatedEmail] = validateEmail(email);
        if (emailValid && passowrd && passowrd.length > 6) {
            const pass = await genHash(password);
            const newAdmin = new Admin({
                name: name,
                email: validatedEmail,
                password: pass,
            });
            newAdmin.save((err, newAdmin) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(parseAdmins([newAdmin])[0]);
                }
            });
        } else {
            reject(ERRORS.AUTH_INVALID);
        }
    });
};
const authenticate = ({email, password} = {}) => {
    return new Promise((resolve, reject) => {
        const [emailValid, validatedEmail] = validateEmail(email);
        if (emailValid && password && password.length) {
            //TODO lock account after 3 tries
            Admin.findOne({email: validatedEmail})
                .then((adminDoc) => {
                    if (adminDoc) {
                        checkPassword(password, adminDoc.password).then(
                            (isMatch) => {
                                if (isMatch) {
                                    const profile = parseAdmins([adminDoc])[0];
                                    jwt.sign(
                                        {id: adminDoc._id},
                                        config.ADMIN_SECRET,
                                        {algorithm: 'RS256'},
                                        (err, token) => {
                                            if (err) throw err;
                                            resolve({
                                                token,
                                                profile,
                                            });
                                        }
                                    );
                                } else {
                                    reject(ERRORS.AUTH_INVALID);
                                }
                            }
                        );
                    } else {
                        reject(ERRORS.AUTH_INVALID);
                    }
                })
                .catch(reject);
        } else {
            reject(ERRORS.AUTH_INVALID);
        }
    });
};
const getAllAdmins = ({skip, limit} = {}) => {
    return new Promise((resolve, reject) => {
        Admin.find({})
            .skip(skip)
            .limit(limit)
            .lean()
            .then((adminDocs) => {
                resolve(parseAdmins(adminDocs));
            })
            .catch(reject);
    });
};
const getAdmin = ({admin_id} = {}) => {
    return new Promise((resolve, reject) => {
        Admin.findById(admin_id)
            .then((adminDoc) => {
                if (adminDoc) {
                    resolve(parseAdmins([adminDoc])[0]);
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};

const updateAdmin = ({admin_id, name, email} = {}) => {
    return new Promise((resolve, reject) => {
        Admin.findById(admin_id)
            .then(async (adminDoc) => {
                if (adminDoc) {
                    const [emailValid, validatedEmail] = validateEmail(email);
                    if (emailValid) {
                        adminDoc.set({
                            ...(name ? {name} : {}),
                            ...(email ? {email: validatedEmail} : {}),
                        });
                        adminDoc.save((err, updatedAdmin) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(parseAdmins([updatedAdmin])[0]);
                            }
                        });
                    } else {
                        reject(ERRORS.EMAIL_INVALID);
                    }
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};

const deleteAdmin = ({admin_id} = {}) => {
    return new Promise((resolve, reject) => {
        Admin.findById(admin_id)
            .then((adminDoc) => {
                if (adminDoc) {
                    adminDoc.remove((err, removedAdmin) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(parseAdmins([removedAdmin])[0]);
                        }
                    });
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};

const __getForAuth__ = ({id} = {}) => {
    return new Promise((resolve, reject) => {
        Admin.findById(id)
            .then((adminDoc) => {
                if (adminDoc) {
                    resolve(parseAdmins([adminDoc])[0]);
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};
module.exports = {
    makeAdmin,
    authenticate,
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    __getForAuth__,
};

const parseAdmins = (admins = []) => {
    if (admins && admins.length) {
        return admins.map((u) => ({
            admin_id: u._id,
            name: u.name,
            email: u.email,
        }));
    }
    return [];
};
