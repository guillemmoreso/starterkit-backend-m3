const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET clubs listing. */
router.get('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

router.get('/:clubId', checkIfLoggedIn, async (req, res, next) => {
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

module.exports = router;
