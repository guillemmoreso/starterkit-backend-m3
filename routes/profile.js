const express = require("express");

const router = express.Router();
const User = require("../models/User");
const Club = require("../models/Club");
const Booking = require("../models/Booking");

const { checkIfLoggedIn, checkUsernameNotEmpty } = require("../middlewares");

/* PUT edits user profile  */
router.put(
  "/edit-profile",
  checkUsernameNotEmpty,
  checkIfLoggedIn,

  async (req, res, next) => {
    const { name, surname, username } = res.locals.auth;
    const userID = req.session.currentUser._id;

    try {
      const userModifiedData = await User.findByIdAndUpdate(
        userID,
        {
          username,
          name,
          surname
        },
        { new: true }
      );

      req.session.currentUser = userModifiedData;
      return res.json(userModifiedData);
    } catch (error) {
      next(error);
    }
  }
);

/* POST user account is deleted  */
router.post("/edit-profile/delete", checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;

  try {
    await User.findByIdAndDelete(userID);
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

/* POST user avatar image */
router.put("/edit-profile/upload", checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;
  const { avatarImgUpload } = req.body;

  try {
    const userModifiedData = await User.findByIdAndUpdate(
      userID,
      {
        avatarImg: avatarImgUpload
      },
      { new: true }
    );

    req.session.currentUser = userModifiedData;
    return res.json(userModifiedData);
  } catch (error) {
    next(error);
  }
});

/* GET a list of user favorite clubs */
router.get("/favorites", checkIfLoggedIn, async (req, res, next) => {
  try {
    const userFavoriteClubs = req.session.currentUser.clubs;
    const clubs = await Club.find({ _id: { $in: userFavoriteClubs } });

    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

/* GET a list of all past bookings to edit game results */
router.get("/results", checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;
  try {
    const userBookings = await Booking.find({
      user: { $eq: userID },
      day: { $lt: Date() }
    })
      .sort({ day: -1 })
      .populate("court user club");

    res.json(userBookings);
  } catch (error) {
    next(error);
  }
});

/* PUT update game result */
router.put("/results/:bookingId", checkIfLoggedIn, async (req, res, next) => {
  const { bookingId } = req.params;
  const { gameResult } = req.body;

  try {
    const bookingGameWonUpdate = await Booking.findByIdAndUpdate(
      bookingId,
      {
        gameResult
      },
      { new: true }
    );

    return res.json(bookingGameWonUpdate);
  } catch (error) {
    next(error);
  }
});

/* GET the list of friends */
router.get("/friends", checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;

  try {
    const user = await User.findById(userID);
    const findNames = await User.find({
      _id: { $in: user.friends }
    });

    res.json(findNames);
  } catch (error) {
    next(error);
  }
});

/* GET all app users to send friend petitions */
router.get("/friends/users", checkIfLoggedIn, async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

/* GET all petitions received */
router.get("/friends/petitions", checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;

  try {
    const user = await User.findById(userID);
    const userPetitions = await User.find({
      _id: { $in: user.petitions }
    }).populate("user");

    return res.json(userPetitions);
  } catch (error) {
    next(error);
  }
});

/* PUT accept petitions */
router.put(
  "/friends/petitions/:petitionUserId/accept",
  checkIfLoggedIn,
  async (req, res, next) => {
    const { petitionUserId } = req.params;
    const userId = req.session.currentUser._id;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { petitions: petitionUserId },
          $push: { friends: petitionUserId }
        },
        { new: true }
      );

      const petitioner = await User.findByIdAndUpdate(
        petitionUserId,
        {
          $push: { friends: userId }
        },
        { new: true }
      );

      req.session.currentUser = updatedUser;
      res.json({ updatedUser, petitioner });
    } catch (error) {
      next(error);
    }
  }
);

/* PUT deny petitions */
router.put(
  "/friends/petitions/:petitionUserId/deny",
  checkIfLoggedIn,
  async (req, res, next) => {
    const { petitionUserId } = req.params;
    const userId = req.session.currentUser._id;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { petitions: petitionUserId }
        },
        { new: true }
      );

      req.session.currentUser = updatedUser;
      res.json({ updatedUser });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
