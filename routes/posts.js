const express = require("express");
const router = express.Router();
const {
  getposts,
  getpost,
  createpost,
  updatepost,
  deletepost,
  likepost,
} = require("../controllers/posts");

router.get("/", getposts);
router.get("/:id", getpost);
router.post("/", createpost);
router.patch("/:id", updatepost);
router.delete("/:id", deletepost);
router.patch("/:id/like", likepost);

module.exports = router;
