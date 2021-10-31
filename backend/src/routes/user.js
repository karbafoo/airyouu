const {UserController, PackageController} = require('../controllers');
const HttpHandler = require('../http-handler/http.handler');
async function routes(fastify, options) {
    fastify.addHook('preHandler', fastify.auth([fastify.verifyJWTandLevel]));
    fastify.route({
        method: 'GET',
        url: '/packages',
        handler: GetPackages,
    });
    fastify.route({
        method: 'GET',
        url: '/packages/:package_id',
        handler: GetPackage,
    });
}
module.exports = routes;

const GetPackages = async (request, reply) => {
    try {
        console.log('request.user\n\n\n', request.user);
        PackageController.getAllPackagesForUser({user: request.user.user_id})
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
const GetPackage = async (request, reply) => {
    try {
        PackageController.getPackage(request.params)
            .then((result) => {
                if (
                    result &&
                    request.user.user_id.equals(result.user.user_id)
                ) {
                    HttpHandler.sendResponse(reply, result);
                } else {
                    HttpHandler.sendError(reply, {
                        code: '404',
                        name: 'PACKAGE_NOT_FOUND',
                    });
                }
            })
            .catch((err) => {
                HttpHandler.sendError(reply, err);
            });
    } catch (err) {
        HttpHandler.sendError(reply, err);
    }
};
