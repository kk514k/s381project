const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Post = require('../models/Post');

// Get all posts with optional search
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let query = { author: req.user._id };

        // If search query exists, add it to the MongoDB query
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('posts/index', {
            posts,
            search: searchQuery // Pass search query to template
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching posts');
        res.redirect('/');
    }
});

// Create new post form
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('posts/create');
});

// Create new post
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({
            title,
            content,
            author: req.user.id
        });
        await newPost.save();
        req.flash('success_msg', 'Post created successfully');
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating post');
        res.redirect('/posts/new');
    }
});

// Show single post
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }
        res.render('posts/show', { post });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Post not found');
        res.redirect('/posts');
    }
});

// Edit post form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }

        // Check post ownership
        if (post.author.toString() !== req.user.id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/posts');
        }

        res.render('posts/edit', { post });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching post');
        res.redirect('/posts');
    }
});

// Update post
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }

        // Check post ownership
        if (post.author.toString() !== req.user.id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/posts');
        }

        post.title = req.body.title;
        post.content = req.body.content;
        post.updatedAt = Date.now();

        await post.save();
        req.flash('success_msg', 'Post updated successfully');
        res.redirect(`/posts/${post.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating post');
        res.redirect('/posts');
    }
});

// Delete post
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }

        // Check post ownership
        if (post.author.toString() !== req.user.id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/posts');
        }

        await post.deleteOne();
        req.flash('success_msg', 'Post deleted successfully');
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting post');
        res.redirect('/posts');
    }
});

module.exports = router;
