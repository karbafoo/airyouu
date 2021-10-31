const Status = require('./status.model');
const ERRORS = require('../../util/ERRORS.json');
const NewStatus = (obj, obj_type, status) => {
    return new Promise((resolve, reject) => {
        if (!status || !obj || !obj_type) {
            reject(ERRORS.STATUS_INVALID);
        } else {
            const nStatus = new Status({
                id: obj,
                type: obj_type,
                status: status,
                prev: obj.status,
            });
            nStatus.save((err, statusDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(statusDoc);
                }
            });
        }
    });
};

module.exports = {
    NewStatus,
};
