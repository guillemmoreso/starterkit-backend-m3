const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Club = require('../models/Club');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET filtered clubs listing. */
router.get('/', async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('court user club');
    console.log('bookings: ', bookings);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

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

module.exports = router;
