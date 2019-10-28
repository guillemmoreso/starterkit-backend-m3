const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET filtered clubs listing. */
router.get('/', async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('courts users clubs');
    console.log('bookings: ', bookings);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
