const express = require("express");

const router = express.Router();
const Club = require("../models/Club");
const Booking = require("../models/Booking");
const User = require("../models/User");

const { checkIfLoggedIn } = require("../middlewares/index");

router.get("/:playerId", async (req, res, next) => {
  const { playerId } = req.params;
  try {
    const player = await User.findById(playerId);
    const games = await Booking.find({
      user: { $eq: playerId }
    });
    res.json({ player, games });
  } catch (error) {
    next(error);
  }
});

router.put("/:playerId", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const { level } = req.body;

  try {
    const userModifiedData = await User.findByIdAndUpdate(
      userId,
      {
        level
      },
      { new: true }
    );
    req.session.currentUser = userModifiedData;
    return res.json(userModifiedData);
  } catch (error) {
    next(error);
  }
});

/* PUT to manage petitions */
router.put("/:playerId/petition", async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const userId = req.session.currentUser._id;
    const currentPetitions = req.session.currentUser.petitions;
    let updatedUser = null;
    if (currentPetitions.includes(playerId)) {
      updatedUser = null;
    } else {
      updatedUser = await User.findByIdAndUpdate(
        playerId,
        { $push: { petitions: userId } },
        { new: true }
      );
    }
    req.session.currentUser = updatedUser;
    console.log("updatedUser", updatedUser);
    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
