const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "/images/profilePic.png" },
  likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  // 从用户角度考虑: 该用户转发了那条消息
  retweets: [{ type: Schema.Types.ObjectId, ref: "Post" }],
}, { timestamps: true });

var User = mongoose.model('User', UserSchema);
module.exports = User;