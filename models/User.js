const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String },
    surname: { type: String },
    hashedPassword: { type: String },
    avatarImg: {
      type: String,
      default:
        "https://res.cloudinary.com/dalhi9ynf/image/upload/v1573759850/profile_cj4jfx.svg"
    },
    clubs: [{ type: ObjectId, ref: "Club" }],
    friends: [{ type: ObjectId, ref: "User" }],
    petitions: [{ type: ObjectId, ref: "User" }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
