const express = require('express');
const router = express.Router();

const Club = require('../models/Club');

const { checkIfLoggedIn } = require('../middlewares/index');

router.get('/', async (req, res, next) => {
  try {
    const listOfClubs = await Club.find();
    res.status(200).json({ listOfClubs });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const response = await Club.findById(clubId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
