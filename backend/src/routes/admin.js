const {
    AdminController,
    UserController,
    PackageController,
} = require('../controllers');

const HttpHandler = require('../http-handler/http.handler');
async function routes(fastify, options) {
    fastify.addHook('preHandler', fastify.auth([fastify.verifyJWTandLevel]));
    fastify.route({
        method: 'GET',
        url: '/',
        handler: GetAdmins,
    });
    fastify.route({
        method: 'GET',
        url: '/:admin_id',
        handler: GetAdmin,
    });
    fastify.route({
        method: 'POST',
        url: '/new',
        handler: MakeAdmin,
    });
    fastify.route({
        method: 'POST',
        url: '/update',
        handler: UpdateAdmin,
    });
    fastify.route({
        method: 'POST',
        url: '/remove',
        handler: DeleteAdmin,
    });
    //User control
    fastify.route({
        method: 'GET',
        url: '/user/',
        handler: GetUsers,
    });
    //Delivery Control
    fastify.route({
        method: 'POST',
        url: '/delivery/new',
        handler: NewDelivery,
    });
    fastify.route({
        method: 'GET',
        url: '/delivery/',
        handler: GetPackages,
    });
    fastify.route({
        method: 'GET',
        url: '/delivery/:package_id',
        handler: GetPackage,
    });
    fastify.route({
        method: 'POST',
        url: '/delivery/update',
        handler: UpdatePackage,
    });
    fastify.route({
        method: 'POST',
        url: '/delivery/update-point',
        handler: UpdatePackagePoint,
    });
}
module.exports = routes;

const GetAdmins = async (request, reply) => {
    try {
        AdminController.getAllAdmins(request.params)
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
const GetAdmin = async (request, reply) => {
    try {
        AdminController.getAdmin(request.params)
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
const MakeAdmin = async (request, reply) => {
    try {
        AdminController.makeAdmin(request.body)
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

const UpdateAdmin = async (request, reply) => {
    try {
        AdminController.updateAdmin(request.body)
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

const DeleteAdmin = async (request, reply) => {
    try {
        AdminController.deleteAdmin(request.body)
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
const GetUsers = async (request, reply) => {
    try {
        UserController.getAllUsers(request.params)
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
const NewDelivery = async (request, reply) => {
    try {
        PackageController.makeNewDelivery(request.body)
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
const GetPackages = async (request, reply) => {
    try {
        PackageController.getAllPackages(request.params)
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
                HttpHandler.sendResponse(reply, result);
            })
            .catch((err) => {
                HttpHandler.sendError(reply, err);
            });
    } catch (err) {
        HttpHandler.sendError(reply, err);
    }
};
const UpdatePackage = async (request, reply) => {
    try {
        console.log('request.body\n\n', request.body);
        PackageController.updatePackage(request.body)
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
const UpdatePackagePoint = async (request, reply) => {
    try {
        PackageController.updatePackagePoint(request.body)
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
