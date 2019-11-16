const express = require("express");

const router = express.Router();
const Club = require("../models/Club");
const Booking = require("../models/Booking");
const User = require("../models/User");

const { checkIfLoggedIn } = require("../middlewares/index");

/* GET all clubs listing. */
router.get("/", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:playerId", async (req, res, next) => {
  const { playerId } = req.params;
  try {
    const player = await User.findById(playerId);
    // const gameWons = await Booking.find({
    //   user: { $eq: playerId }
    // });
    // console.log("GAME WONS", gameWons);
    res.json(player);
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
    console.log("petions", req.session.currentUser);
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
    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
