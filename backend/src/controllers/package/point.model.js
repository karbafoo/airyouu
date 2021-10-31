const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Point Schema
const PointSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        position: {
            type: {lat: String, lng: String},
            required: true,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status',
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

const Point = mongoose.models.Point || mongoose.model('Point', PointSchema);
module.exports = Point;
