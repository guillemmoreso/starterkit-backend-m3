const express = require("express");
const router = express.Router();
const Club = require("../models/Club");
const Booking = require("../models/Booking");

const { checkIfLoggedIn } = require("../middlewares/index");

/* GET all clubs that have availability at the current hour range */
router.get("/", async (req, res, next) => {
  try {
    const yesterday = new Date(Date.now() - 864e5);
    const tomorrow = new Date(Date.now() + 864e5);

    const clubs = await Club.find({
      openingHours: { $gt: new Date().getHours() }
    });
    console.log("Phase1:Clubs", clubs);
    const searchDatePickerMatchInBooking = await Booking.find({
      startingHour: { $eq: new Date().getHours() },
      day: { $gte: yesterday, $lte: tomorrow }
    }).populate("club");
    console.log(
      "Phase2:searchDatePickerMatchInBooking",
      searchDatePickerMatchInBooking
    );

    const unavailableClubs = searchDatePickerMatchInBooking.map(booking => {
      return booking.club._id;
    });

    console.log("Phase3:unavailableClubs", unavailableClubs);

    if (unavailableClubs.length === clubs.length) {
      arrOfAvailableClubs = [];
    } else if (searchDatePickerMatchInBooking.length === 0) {
      arrOfAvailableClubs = clubs;
    } else {
      arrOfAvailableClubs = await Club.find({
        _id: { $ne: unavailableClubs },
        openingHours: { $eq: new Date().getHours() }
      });
    }

    res.json(arrOfAvailableClubs);
  } catch (error) {
    next(error);
  }
});

/* POST receive search from user and return the clubs with availability  */
router.post("/", async (req, res, next) => {
  const { date, searchStartingHour } = req.body;
  const submitedHour = searchStartingHour;
  const submitedDate = date;

  try {
    const clubsStartingHourIsSet = await Club.find({
      openingHours: { $eq: submitedHour }
    });

    const searchDatePickerMatchInBooking = await Booking.find({
      startingHour: { $eq: submitedHour },
      day: { $eq: submitedDate }
    }).populate("club");

    const unavailableClubs = searchDatePickerMatchInBooking.map(booking => {
      return booking.club._id;
    });

    if (unavailableClubs.length === clubsStartingHourIsSet.length) {
      arrOfAvailableClubs = [];
    } else if (searchDatePickerMatchInBooking.length === 0) {
      arrOfAvailableClubs = await Club.find({
        openingHours: { $eq: submitedHour }
      });
    } else {
      arrOfAvailableClubs = await Club.find({
        _id: { $ne: unavailableClubs },
        openingHours: { $eq: submitedHour }
      });
    }

    return res.json(arrOfAvailableClubs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
