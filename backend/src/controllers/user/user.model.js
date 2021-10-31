const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = mongoose.Schema(
    {
        status: {
            type: Schema.Types.ObjectId,
            ref: 'status',
            required: true,
        },
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
