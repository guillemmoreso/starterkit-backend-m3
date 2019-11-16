const express = require("express");

const router = express.Router();
const Booking = require("../models/Booking");
const Court = require("../models/Court");
const Club = require("../models/Club");

const { checkIfLoggedIn } = require("../middlewares/index");

/* GET a list of all user bookings sorted by upcoming date */
router.get("/", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const yesterday = new Date(Date.now() - 864e5);
    const bookings = await Booking.find({
      user: { $eq: userId },
      day: { $gt: Date.now() },
      // day: { $gt: yesterday }
    })
      .sort({ day: 1 })
      .populate("court user club");
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/:bookingId", async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).populate(
      "court club user"
    );
    if (booking) {
      res.json(booking);
    } else {
      res.json({});
    }
  } catch (error) {
    next(error);
  }
});

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
