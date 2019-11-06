const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Court = require('../models/Court');
const User = require('../models/User');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET clubs listing. */
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find();
    console.log('CLUBS: ', clubs);
    res.json(clubs);
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

router.post('/', async (req, res, next) => {
  const { name, description, city, price, openingHours, location } = req.body;
  try {
    const club = await Club.create({
      name,
      city,
      description,
      price,
      openingHours,
      location,
    });
    res.json(club);
  } catch (error) {
    next(error);
  }
});

// router.post('/courts', async (req, res, next) => {
//   const { courtName, clubCourt } = req.body;
//   try {
//     const club = await Court.create({
//       courtName,
//       clubCourt,
//     });
//     res.json(club);
//   } catch (error) {
//     next(error);
//   }
// });

// router.put('/:clubId', async (req, res, next) => {
//   const { clubId } = req.params;
//   const { name, description, city, price, openingHours, location } = req.body;
//   try {
//     const club = await Club.findByIdAndUpdate(clubId, {
//       name,
//       city,
//       description,
//       price,
//       openingHours,
//       location,
//     });
//     res.json(club);
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete('/:clubId', async (req, res, next) => {
//   const { clubId } = req.params;
//   try {
//     const club = await Club.findByIdAndDelete(clubId);
//     res.json(club);
//   } catch (error) {
//     next(error);
//   }
// });

router.put('/:clubId/switch', async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const userId = req.session.currentUser._id;
    const currentClubs = req.session.currentUser.clubs;
    let updatedUser = null;
    console.log('currentClubs', currentClubs);
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
