const {AdminController} = require('../controllers');

const HttpHandler = require('../http-handler/http.handler');
async function routes(fastify, options) {
    fastify.route({
        method: 'POST',
        url: '/login',
        handler: login,
    });
}
module.exports = routes;

const login = async (request, reply) => {
    try {
        console.log('request.body', request.body);
        AdminController.authenticate(request.body)
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
