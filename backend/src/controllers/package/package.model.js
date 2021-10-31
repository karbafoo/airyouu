const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Package Schema
const PackageSchema = mongoose.Schema(
    {
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        points: {
            type: [{type: Schema.Types.ObjectId, ref: 'Point'}],
            required: true,
        },
        items: {
            type: [
                {
                    name: String,
                    quantity: Number,
                    description: String,
                    volume: Number,
                    weight: Number,
                },
            ],
            default: [],
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

const Package =
    mongoose.models.Package || mongoose.model('Package', PackageSchema);
module.exports = Package;
