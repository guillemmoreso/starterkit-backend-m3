require('dotenv').config();
const mongoose = require('mongoose');
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

const bookings = [
  {
    // user: ObjectId('5db70a4b2f679a10474afa53'),
    // club: ObjectId('5db2df46247bab3015f1d615'),
    // court: ObjectId('5db2e0e0247bab3015f1d61c'),
    day: Date(),
    startingHour: 11,
  },
];

Booking.create(bookings)
  .then(booking => {
    console.log('inserted booking ', booking);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
