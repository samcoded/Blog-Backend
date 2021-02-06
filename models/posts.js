const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  body: { type: String },
  author: { type: String, required: true },
  createdAt: { type: String, required: true },
  tags: { type: [String], default: [] },
  category: { type: [String], default: [] },
  likes: { type: [String], default: [] },
  id: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
