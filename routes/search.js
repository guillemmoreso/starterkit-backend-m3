const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Booking = require('../models/Booking');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET filtered clubs listing. */

router.post('/', async (req, res, next) => {
  const { date, searchStartingHour } = req.body;

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

router.get('/', async (req, res, next) => {
  const { date, startingHour } = req.body;
  try {
    const clubs = await Club.find({
      openingHours: { $gt: new Date().getHours() },
    }).populate('courts');
    if (clubs.length === 0) {
      res.json(clubs);
    } else {
      //   console.log('CLUBFILTER', clubs);
      res.json(clubs);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  const { date, startingHour } = req.body;
  try {
    const clubs = await Club.find({
      openingHours: { $gt: new Date().getHours() },
    }).populate('courts');
    if (clubs.length === 0) {
      res.json(clubs);
    } else {
      //   console.log('CLUBFILTER', clubs);
      res.json(clubs);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
