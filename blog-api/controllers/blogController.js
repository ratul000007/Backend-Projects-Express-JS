const BlogPost = require("../models/BlogPost");

// Create a new blog post (authors only)
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newPost = await BlogPost.create({
            title,
            content,
            author: req.user._id,
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all posts (public)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find()
            .populate("author", "email role")
            .sort({ createdAt: -1 });
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single post by ID (public)
exports.getPostsById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id).populate("author", "email role");
        if(!post) return res.status(400).json({ message: "Post not found" });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a blog post
exports.updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if(!post) return res.status(404).json({ message: "Post not found" });

        if(post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        // Update fields
        const { title, content } = req.body;
        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;

        const updatedPost = await post.save();

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a blog post
exports.deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if(!post) return res.status(404).json({ message: "Post not found" });

        if(post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};