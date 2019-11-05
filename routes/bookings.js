const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Club = require('../models/Club');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET filtered clubs listing. */
router.get('/', async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const yesterday = new Date(Date.now() - 864e5);
    const bookings = await Booking.find({
      user: { $eq: userId },
      day: { $gt: yesterday },
    })
      .sort({ day: 1 })
      .populate('court user club');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// router.get('/:clubId', async (req, res, next) => {
//   const { clubId } = req.params;
//   try {
//     const club = await Club.findById(clubId).populate('courts');
//     if (club) {
//       res.json(club);
//     } else {
//       res.json({});
//     }
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
