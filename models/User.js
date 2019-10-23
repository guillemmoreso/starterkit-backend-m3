const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    nameAndSurname: { type: String, required: true },
    birthdate: { type: Date, required: true },
    city: { type: String },
    img: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
