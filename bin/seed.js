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
    courts: ['5db1a7c8ba2eed10af5b7115'],
  },
  {
    name: 'Club tenis la Salut',
    description: 'Tenis la Salut...',
    city: 'Barcelona',
    price: 10,
    courts: ['5db1a7c8ba2eed10af5b7116'],
  },
  {
    name: 'Club tenis Laietà',
    description: 'Tenis Laietà...',
    city: 'Barcelona',
    price: 9,
    courts: ['5db1a7c8ba2eed10af5b7117'],
  },
];

const courts = [
  {
    courtName: 'Barcelona-1',
    timetableArray: ['1', '2', '3'],
  },
  {
    courtName: 'Salut-1',
    timetableArray: ['1', '2', '3'],
  },
  {
    courtName: 'Laietà-1',
    timetableArray: ['1', '2', '3'],
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

Court.create(courts)
  .then(court => {
    console.log('inserted court ', court);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
