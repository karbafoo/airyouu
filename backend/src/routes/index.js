async function routes(fastify, options) {
    fastify.register(require('./admin'), {prefix: '/admin'});
    fastify.register(require('./admin-auth'), {prefix: '/auth/admin'});
    fastify.register(require('./user'), {prefix: '/user'});
    fastify.register(require('./user-auth'), {prefix: '/auth'});
}

module.exports = routes;
