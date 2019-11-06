const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Court = require('../models/Court');
const User = require('../models/User');

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
  const { clubId } = req.params;
  const userID = req.session.currentUser._id;

  try {
    // const courtID = await Club.find({ _id: clubId }, { courts: 1, _id: 0 });
    // console.log('COURTID', courtID);

    const newBooking = await Booking.create({
      user: userID,
      club: clubId,
      // court: courtID,
      // day: stateDay,
      // startingHour: stateStartingHour,
    });
    res.json(newBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
