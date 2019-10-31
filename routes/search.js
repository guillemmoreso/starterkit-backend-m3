const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Booking = require('../models/Booking');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET filtered clubs listing. */

router.post('/', async (req, res, next) => {
  const { date, searchStartingHour } = req.body;
  try {
    const clubsStartingHour = await Club.find({
      openingHours: { $eq: searchStartingHour },
    });
    // console.log('date', date);

    const searchMatchInBooking = await Booking.find({
      // startingHour: { $eq: searchStartingHour },
      day: { $eq: date },
    }).populate('club');

    console.log('searchMatchInBooking', searchMatchInBooking);

    return res.json(clubsStartingHour);
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
