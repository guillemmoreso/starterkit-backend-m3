const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Court = require('../models/Court');
const User = require('../models/User');
const Booking = require('../models/Booking');

const { checkIfLoggedIn } = require('../middlewares/index');

router.get('/:clubId', async (req, res, next) => {
  const { clubId } = req.params;

  try {
    const club = await Club.findById(clubId).populate('courts');
    if (club) {
      res.json(club);
    } else {
      res.json({});
    }
  } catch (error) {
    next(error);
  }
});

router.post('/:clubId', async (req, res, next) => {
  const { searchStartingHour, date, clubId, userId, courtId } = req.body;

  try {
    const newBooking = await Booking.create({
      user: userId,
      club: clubId,
      court: courtId,
      day: date,
      startingHour: searchStartingHour,
    });
    console.log('newBooking', newBooking);
    res.json(newBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
