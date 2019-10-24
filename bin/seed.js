require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Club = require('../models/Club');
const Court = require('../models/Court');
const Booking = require('../models/Booking');

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to: ', process.env.MONGO_URL);
  })
  .catch(error => {
    console.error(error);
  });

const clubs = [
  {
    name: 'Club tenis Barcelona',
    description: 'Tenis barcelona...',
    city: 'Barcelona',
    price: 12,
  },
  {
    name: 'Club tenis la Salut',
    description: 'Tenis la Salut...',
    city: 'Barcelona',
    price: 10,
  },
  {
    name: 'Club tenis Laietà',
    description: 'Tenis Laietà...',
    city: 'Barcelona',
    price: 9,
  },
];

Club.create(clubs)
  .then(club => {
    console.log('inserted club ', club);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
