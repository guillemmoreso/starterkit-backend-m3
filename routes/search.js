const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Booking = require('../models/Booking');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET all clubs that have availability at the current hour range */
// MISSING IF ALREADY BOOKED!!
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find({
      openingHours: { $gt: new Date().getHours() },
    });
    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

/* POST receive search from user and return the clubs with availability  */
router.post('/', async (req, res, next) => {
  const { date, searchStartingHour } = req.body;
  console.log('body: ', req.body);
  try {
    const clubsStartingHourIsSet = await Club.find({
      openingHours: { $eq: searchStartingHour },
    });

    const searchDatePickerMatchInBooking = await Booking.find({
      startingHour: { $eq: searchStartingHour },
      day: { $eq: date },
    }).populate('club');

    const unavailableClubs = searchDatePickerMatchInBooking.map(booking => {
      return booking.club._id;
    });

    if (unavailableClubs.length === clubsStartingHourIsSet.length) {
      arrOfAvailableClubs = [];
    } else if (searchDatePickerMatchInBooking.length === 0) {
      arrOfAvailableClubs = await Club.find({
        openingHours: { $eq: searchStartingHour },
      });
    } else {
      arrOfAvailableClubs = await Club.find({
        _id: { $ne: unavailableClubs },
        openingHours: { $eq: searchStartingHour },
      });
    }

    return res.json(arrOfAvailableClubs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
