const User = require('./user.model');
const ERRORS = require('../../util/ERRORS.json');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const {validateEmail} = require('../../util/validator');
const {genHash, checkPassword} = require('../../util/hasher');
const {NewStatus} = require('../status/status.controller');
const signup = ({email, name, password} = {}) => {
    return new Promise(async (resolve, reject) => {
        const [emailValid, validatedEmail] = validateEmail(email);
        if (emailValid && password && password.length > 4) {
            const pass = await genHash(password);

            const newUser = new User({
                name: name,
                email: validatedEmail,
                password: pass,
            });
            const statusDoc = await NewStatus(newUser, 'User', 'active');
            newUser.set({status: statusDoc});
            newUser.save((err, newUser) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(parseUsers([newUser])[0]);
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
            User.findOne({email: validatedEmail})
                .then((userDoc) => {
                    if (userDoc) {
                        checkPassword(password, userDoc.password).then(
                            (isMatch) => {
                                if (isMatch) {
                                    const profile = parseUsers([userDoc])[0];
                                    jwt.sign(
                                        {id: userDoc._id},
                                        config.USER_SECRET,
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
                        // reject(ERRORS.USER_NOT_FOUND);
                    }
                })
                .catch(reject);
        } else {
            reject(ERRORS.AUTH_INVALID);
        }
    });
};
const getAllUsers = ({skip, limit} = {}) => {
    return new Promise((resolve, reject) => {
        User.find({})
            .skip(skip)
            .limit(limit)
            .lean()
            .then((userDocs) => {
                resolve(parseUsers(userDocs));
            })
            .catch(reject);
    });
};
const getUser = ({user_id} = {}) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id)
            .then((userDoc) => {
                if (userDoc) {
                    resolve(parseUsers([userDoc])[0]);
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};

const updateUser = ({user_id, name, email, status} = {}) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id)
            .then(async (userDoc) => {
                if (userDoc) {
                    const [emailValid, validatedEmail] = validateEmail(email);
                    if (emailValid) {
                        userDoc.set({
                            ...(name ? {name} : {}),
                            ...(email ? {email: validatedEmail} : {}),
                        });
                        if (status) {
                            const statusDoc = await NewStatus(
                                user,
                                'User',
                                status
                            );
                            userDoc.set({status: statusDoc});
                            userDoc.save((err, updatedUser) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(parseUsers([updatedUser])[0]);
                                }
                            });
                        } else {
                            userDoc.save((err, updatedUser) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(parseUsers([updatedUser])[0]);
                                }
                            });
                        }
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

const deleteUser = ({user_id} = {}) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id)
            .then((userDoc) => {
                if (userDoc) {
                    userDoc.remove((err, removedUser) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(parseUsers([removedUser])[0]);
                        }
                    });
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};
const parseUsers = (users = []) => {
    if (users && users.length) {
        return users.map((u) => ({
            user_id: u._id,
            name: u.name,
            email: u.email,
        }));
    }
    return [];
};

const __getForAuth__ = ({id} = {}) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
            .then((userDoc) => {
                if (userDoc) {
                    resolve(parseUsers([userDoc])[0]);
                } else {
                    reject(ERRORS.USER_NOT_FOUND);
                }
            })
            .catch(reject);
    });
};
module.exports = {
    signup,
    authenticate,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    parseUsers,
    __getForAuth__,
};
