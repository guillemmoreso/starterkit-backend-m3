const express = require('express');
const bcrypt = require('bcrypt');

const {
  checkUsernameAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares');

const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(401).json({ code: 'unauthorized' });
  }
});

router.post(
  '/signup',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    console.log('post: ', res.locals.auth);
    const { name, surname, username, password } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      console.log('Uuuuser is:', res.locals.auth);
      if (user) {
        return res.status(422).json({ code: 'username-not-unique' });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        username,
        hashedPassword,
        name,
        surname,
      });
      req.session.currentUser = newUser;
      console.log('Neeewuser is:', newUser);

      return res.json(newUser);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const { username, password } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        return res.json(user);
      }
      return res.status(404).json({ code: 'not-found' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    return res.status(204).send();
  });
});

// router.post('/delete', checkIfLoggedIn, async (req, res, next) => {
//   const { username, password } = res.locals.auth;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ code: 'not-found' });
//     }
//     if (bcrypt.compareSync(password, user.hashedPassword)) {
//       req.session.currentUser = user;
//       return res.json(user);
//     }
//     return res.status(404).json({ code: 'not-found' });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
