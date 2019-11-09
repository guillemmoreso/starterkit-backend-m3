const express = require('express');

const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');

const { checkIfLoggedIn } = require('../middlewares/index');

/* GET map */
router.get('/', async (req, res, next) => {
  try {
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
