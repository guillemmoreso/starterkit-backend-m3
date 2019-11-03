const express = require('express');
const router = express.Router();
const User = require('../models/User');

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



module.exports = router;
