const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, trim: true },
  postedBy: {
    type: Schema.Types.ObjectId, ref: "User"
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  // 信息的角度考虑： 1. 那条消息被转发了，2. 被谁转发了
  retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
  retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;