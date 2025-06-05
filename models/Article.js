const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    createdAt: { type: Date, default: Date.now }
});

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    publishDate: { type: Date, default: Date.now },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    reviews: [reviewSchema]
});

module.exports = mongoose.model('Article', articleSchema);