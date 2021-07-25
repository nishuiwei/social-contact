const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "/images/profilePic.png" },
})

const User = mongoose.model('User', UserSchema)

module.export = User