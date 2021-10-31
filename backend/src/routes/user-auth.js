const {UserController} = require('../controllers');
const HttpHandler = require('../http-handler/http.handler');
async function routes(fastify, options) {
    fastify.route({
        method: 'POST',
        url: '/login',
        handler: login,
    });
    fastify.route({
        method: 'POST',
        url: '/signup',
        handler: signup,
    });
}
module.exports = routes;

const login = async (request, reply) => {
    try {
        UserController.authenticate(request.body)
            .then((result) => {
                HttpHandler.sendResponse(reply, result);
            })
            .catch((err) => {
                HttpHandler.sendError(reply, err);
            });
    } catch (err) {
        HttpHandler.sendError(reply, err);
    }
};
const signup = async (request, reply) => {
    try {
        UserController.signup(request.body)
            .then((result) => {
                HttpHandler.sendResponse(reply, result);
            })
            .catch((err) => {
                HttpHandler.sendError(reply, err);
            });
    } catch (err) {
        HttpHandler.sendError(reply, err);
    }
};
