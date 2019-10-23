const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const clubSchema = new Schema(
  {
    courts: [{ type: ObjectId, ref: 'Court' }],
    name: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    logo: { type: String, required: true },
    clubImages: { type: String },
    price: { type: Number },
    rating: { type: Number },
    comments: { type: String },
    numberOfCourts: { type: Number, required: true },
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
