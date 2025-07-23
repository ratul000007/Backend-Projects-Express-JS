const express = require("express");
const {
    createPost,
    getAllPosts,
    getPostsById,
    updatePost,
    deletePost,
} = require("../controllers/blogController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

//Public Routes
router.get("/", getAllPosts);
router.get("/:id", getPostsById);

// Protected: only authors can create
router.post("/", protect, authorize("author"), createPost);

// Update post
router.put("/:id", protect, authorize("author"), updatePost);

// Delete post
router.delete("/:id", protect, authorize("author"), deletePost);

module.exports = router;