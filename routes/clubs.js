const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

// const { checkIfLoggedIn } = require('../middlewares/index'); Pendent solucionar el signup per posarho en les routes

/* GET clubs listing. */
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (error) {
    next(error);
  }
});

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

router.post('/', async (req, res, next) => {
  const { name, description, city, price } = req.body;
  try {
    const club = await Club.create({
      name,
      city,
      description,
      price,
    });
    res.json(club);
  } catch (error) {
    next(error);
  }
});

router.put('/:clubId', async (req, res, next) => {
  const { clubId } = req.params;
  const { name, description, city, price } = req.body;
  try {
    const club = await Club.findByIdAndUpdate(clubId, {
      name,
      city,
      description,
      price,
    });
    res.json(club);
  } catch (error) {
    next(error);
  }
});

router.delete('/:clubId', async (req, res, next) => {
  const { clubId } = req.params;
  try {
    const club = await Club.findByIdAndDelete(clubId);
    res.json(club);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
