const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Log} = require('../../util/logger');
const {genHash} = require('../../util/hasher');
// Admin Schema
const AdminSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
module.exports = Admin;

const init = () => {
    Admin.find({})
        .then(async (admins) => {
            if (admins.length === 0) {
                Log('First blood');
                const pass = await genHash('12345678');
                const firstAdmin = new Admin({
                    name: 'Karbafoo',
                    email: 'karbafoo@gmail.com',
                    password: pass,
                });
                firstAdmin.save((err, admin) => {
                    if (err) {
                        Log('Error saving first admin', err);
                    } else {
                        Log('Admin created: ', admin.name);
                    }
                });
            }
        })
        .catch((err) => Log('Error creating first admin', err));
};
init();
