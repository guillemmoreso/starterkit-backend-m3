const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET filtered clubs listing. */
router.get('/', async (req, res, next) => {
  const { date } = req.body;
  try {
    const clubs = await Club.find({
      //   openingHours: { $gt: 23 },
      openingHours: { $gt: new Date().getHours() },
    }).populate('courts');
    if (clubs.length === 0) {
      //COMO PUEDO MANDAR UN MENSAJE AQUÍ? DEBO CONSTRUIR UN OBJETO?
      res.json(clubs);
    } else {
      //   console.log('CLUBFILTER', clubs);
      res.json(clubs);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
