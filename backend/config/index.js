const fs = require('fs');
const path = require('path');
module.exports = {
    DATABASE_NAMURL: 'mongodb://localhost:27017/airyouu',
    ADMIN_SECRET: fs.readFileSync(path.join(__dirname, './pk')),
    USER_SECRET: fs.readFileSync(path.join(__dirname, './pk')),
};
