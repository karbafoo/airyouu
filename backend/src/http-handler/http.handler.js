const ERRORS = require('../util/ERRORS.json');
const sendResponse = (reply, data) => {
    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({data: data, success: true});
};
const sendError = (reply, err) => {
    //TODO
    console.log('err', err);
    if (err) {
        if (err.self) {
            reply.code(406).send({code: err.code, msg: err.name});
            return;
        } else if (err.name === 'CastError') {
            reply.code(406).send({code: err.code || '506', msg: 'BAD_INPUT'});
            return;
        }
    }

    reply.code(403).send({code: err.code || '0', msg: err.msg || 'ERROR'});
};
module.exports = {
    sendResponse,
    sendError,
};
