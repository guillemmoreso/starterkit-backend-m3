const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const courtSchema = new Schema(
  {
    courtName: { type: String },
    timetableArray: [{ type: String }],
    day: { type: Date },
    courtsBooked: [{ type: ObjectId, ref: 'Booking' }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Court = mongoose.model('Court', courtSchema);

module.exports = Court;
