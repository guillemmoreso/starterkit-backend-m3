const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Court = require('../models/Court');
const User = require('../models/User');

const { checkIfLoggedIn } = require('../middlewares/index');

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

router.post('/:clubId', async (req, res, next) => {
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

module.exports = router;
