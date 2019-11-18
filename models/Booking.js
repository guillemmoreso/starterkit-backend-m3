const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const bookingSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User" },
    club: { type: ObjectId, ref: "Club" },
    court: { type: ObjectId, ref: "Court" },
    day: { type: Date },
    startingHour: { type: Number },
    gameResult: { type: String, default: "TBC" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
