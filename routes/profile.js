const express = require('express');

const router = express.Router();
const User = require('../models/User');
const Club = require('../models/Club');
const Booking = require('../models/Booking');

const {
  checkUsernameAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares');

// POST submits profile edit form
router.post(
  '/edit-profile',
  checkUsernameAndPasswordNotEmpty,
  checkIfLoggedIn,

  async (req, res, next) => {
    console.log('post: ', res.locals.auth);
    const { name, surname, username, password } = res.locals.auth;
    const userID = req.session.currentUser._id;

    try {
      const userModifiedData = await User.findByIdAndUpdate(
        userID,
        { username, password, name, surname },
        { new: true },
      );
      req.session.currentUser = userModifiedData;

      return res.json(userModifiedData);
    } catch (error) {
      next(error);
    }
  },
);

// router.get('/edit-profile/delete', async (req, res, next) => {});

router.post('/edit-profile/delete', checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;

  try {
    const userDeleted = await User.findByIdAndDelete(userID);
    console.log('userDeleted', userDeleted);
    req.session.destroy(err => {
      if (err) {
        next(err);
      }
      return res.status(204).send();
    });
  } catch (error) {
    next(error);
  }
});

router.get('/favorites', async (req, res, next) => {
  try {
    const userFavoriteClubs = req.session.currentUser.clubs;
    const clubs = await Club.find({ _id: { $in: userFavoriteClubs } });
    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

router.get('/results', async (req, res, next) => {
  const userID = req.session.currentUser._id;
  try {
    const userBookings = await Booking.find({
      user: { $eq: userID },
      day: { $lt: Date() },
    })
      .sort({ day: -1 })
      .populate('court user club');
    console.log('userBookings', userBookings);
    res.json(userBookings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
