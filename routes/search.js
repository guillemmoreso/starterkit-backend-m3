const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Court = require('../models/Court');

// const { checkIfLoggedIn } = require('../middlewares/index'); Pendent solucionar el signup per posarho en les routes

/* GET filtered clubs listing. */
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find({
      //   openingHours: { $gt: 23 },
      openingHours: { $gt: new Date().getHours() },
    }).populate('courts');
    if (clubs.length === 0) {
      //COMO PUEDO MANDAR UN MENSAJE AQUÍ?
      res.json(clubs);
    } else {
      console.log('CLUBFILTER', clubs);
      res.json(clubs);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
