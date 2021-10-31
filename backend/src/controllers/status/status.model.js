const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Status Schema
const StatusSchema = mongoose.Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
            refPath: 'type',
            required: true,
        },
        type: {
            type: String,
            enum: ['Package', 'Point', 'User'],
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
        },
        prevStatus: {
            type: String,
            default: 'pending',
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

const Status = mongoose.models.Status || mongoose.model('Status', StatusSchema);
module.exports = Status;
