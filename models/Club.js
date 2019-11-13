const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const clubSchema = new Schema(
  {
    courts: [{ type: ObjectId, ref: 'Court' }],
    name: { type: String },
    description: { type: String },
    city: { type: String },
    logo: { type: String },
    clubImages: [{ type: String }],
    price: { type: Number },
    rating: { type: Number },
    comments: { type: String },
    location: { type: String },
    openingHours: [{ type: Number }],
    geometry: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [],
        // required: true,
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
