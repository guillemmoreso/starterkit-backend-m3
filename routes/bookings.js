const express = require("express");

const router = express.Router();
const Booking = require("../models/Booking");
const Court = require("../models/Court");
const Club = require("../models/Club");

const { checkIfLoggedIn } = require("../middlewares/index");

/* GET all user upcoming bookings sorted by date */
router.get("/", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const bookings = await Booking.find({
      user: { $eq: userId },
      day: { $gt: Date.now() }
    })
      .sort({ day: 1 })
      .populate("court user club");

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

/* GET booking details */
router.get("/:bookingId", async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).populate(
      "court club user"
    );

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

/* POST delete an specific from the booking details page */
router.post("/:bookingId/delete", checkIfLoggedIn, async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    const bookingDeleted = await Booking.findByIdAndDelete(bookingId);

    res.json(bookingDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
