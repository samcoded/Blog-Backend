const PostModel = require("../models/posts.js");
const mongoose = require("mongoose");

const getposts = async (req, res) => {
  try {
    const postMessages = await PostModel.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getpost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  res.send(`view single  post ${req.params.id}`);
};

const createpost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostModel({
    ...post,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updatepost = async (req, res) => {
  const { id } = req.params;
  const { title, body, slug, author, tags, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { title, body, slug, author, tags, category, _id: id };

  await PostModel.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

const deletepost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostModel.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

const likepost = async (req, res) => {
  const { id } = req.params;
  const { author } = req.body;

  if (!author) {
    return res.json({ message: "Error" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostModel.findById(id);

  const index = post.likes.findIndex((id) => id === String(author));

  if (index === -1) {
    post.likes.push(author);
  } else {
    post.likes = post.likes.filter((id) => id !== String(author));
  }
  const updatedPost = await PostModel.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

module.exports = {
  getposts,
  getpost,
  createpost,
  updatepost,
  deletepost,
  likepost,
};
