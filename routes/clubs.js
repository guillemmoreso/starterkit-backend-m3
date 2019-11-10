const express = require('express');

const router = express.Router();
const Club = require('../models/Club');
const Booking = require('../models/Booking');
const User = require('../models/User');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET all clubs listing. */
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

router.get('/:clubId', async (req, res, next) => {
  const { clubId } = req.params;
  try {
    const club = await Club.findById(clubId);
    if (club) {
      res.json(club);
    } else {
      res.json({});
    }
  } catch (error) {
    next(error);
  }
});

/* POST receive search from user and return the clubs with availability  */
router.post('/:clubId', async (req, res, next) => {
  const { clubId } = req.params;
  const { date, searchStartingHour } = req.body;

  const submitedHour = searchStartingHour;
  const submitedDate = date;
  try {
    const searchDatePickerMatchInBooking = await Booking.find({
      startingHour: { $eq: submitedHour },
      day: { $eq: submitedDate },
      club: { $eq: clubId },
    });
    console.log(
      'searchDatePickerMatchInBooking',
      searchDatePickerMatchInBooking,
    );
    return res.json(searchDatePickerMatchInBooking);
  } catch (error) {
    next(error);
  }
});

/* PUT to manage user favorite clubs */
router.put('/:clubId/switch', async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const userId = req.session.currentUser._id;
    const currentClubs = req.session.currentUser.clubs;
    let updatedUser = null;
    if (currentClubs.includes(clubId)) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { clubs: clubId } },
        { new: true },
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { clubs: clubId } },
        { new: true },
      );
    }
    req.session.currentUser = updatedUser;
    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
