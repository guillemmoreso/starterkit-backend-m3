const express = require("express");
const router = express.Router();
const Club = require("../models/Club");
const Court = require("../models/Court");
const User = require("../models/User");
const Booking = require("../models/Booking");

const { checkIfLoggedIn } = require("../middlewares/index");

/* GET club data */
router.get("/:clubId", checkIfLoggedIn, async (req, res, next) => {
  const { clubId } = req.params;

  try {
    const club = await Club.findById(clubId).populate("courts");

    res.json(club);
  } catch (error) {
    next(error);
  }
});

/* POST new club booking */
router.post("/:clubId", checkIfLoggedIn, async (req, res, next) => {
  const { searchStartingHour, date, clubId, userId, courtId } = req.body;

  try {
    const newBooking = await Booking.create({
      user: userId,
      club: clubId,
      court: courtId,
      day: date,
      startingHour: searchStartingHour
    });

    res.json(newBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
