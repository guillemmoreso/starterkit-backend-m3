const express = require("express");

const router = express.Router();
const User = require("../models/User");
const Club = require("../models/Club");
const Booking = require("../models/Booking");

const { checkIfLoggedIn, checkUsernameNotEmpty } = require("../middlewares");

// PUT edits profile edit form
router.put(
  "/edit-profile",
  checkUsernameNotEmpty,
  checkIfLoggedIn,

  async (req, res, next) => {
    console.log("reslocals", res.locals.auth);
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

// router.get('/edit-profile/delete', async (req, res, next) => {});

router.post("/edit-profile/delete", checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;

  try {
    const userDeleted = await User.findByIdAndDelete(userID);
    console.log("userDeleted", userDeleted);
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

router.get("/favorites", async (req, res, next) => {
  try {
    const userFavoriteClubs = req.session.currentUser.clubs;
    const clubs = await Club.find({ _id: { $in: userFavoriteClubs } });
    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

router.get("/results", async (req, res, next) => {
  const userID = req.session.currentUser._id;
  try {
    const userBookings = await Booking.find({
      user: { $eq: userID },
      day: { $lt: Date() }
    })
      .sort({ day: -1 })
      .populate("court user club");
    console.log("userBookings", userBookings);
    res.json(userBookings);
  } catch (error) {
    next(error);
  }
});

router.get("/friends", async (req, res, next) => {
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

router.get("/friends/users", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  const userID = req.session.currentUser._id;
  try {
    const user = await User.findById(userID);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/* PUT update game result */
router.put("/results/:bookingId", async (req, res, next) => {
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

// POST submits profile edit form
router.put("/edit-profile/upload", async (req, res, next) => {
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

// GET user petitions
router.get("/friends/petitions", async (req, res, next) => {
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

router.put(
  "/friends/petitions/:petitionUserId/accept",
  async (req, res, next) => {
    const { petitionUserId } = req.params;
    const userId = req.session.currentUser._id;
    try {
      const user = await User.findByIdAndUpdate(
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
      req.session.currentUser = user;
      res.json({ user, petitioner });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
