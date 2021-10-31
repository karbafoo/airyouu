const Log = (...args) => {
    if (process.env.ENV_VARIABLE === 'development') {
        console.log(...args);
    }
};

module.exports = {
    Log,
};
