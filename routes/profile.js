const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {
  checkUsernameAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares');

// GETS the user profile landing page, where he can edit his information
router.get('/edit-profile', async (req, res, next) => {
  const userID = req.session.currentUser;
  try {
    const user = await User.findById(userID);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST submits profile edit form
router.post(
  '/edit-profile',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
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

module.exports = router;
