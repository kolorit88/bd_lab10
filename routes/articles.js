const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Научный журнал' });
});

router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ publishDate: -1 });
        res.render('articles', {
            pageTitle: 'Все статьи',
            articles,
            searchType: 'all'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/articles/search/title', async (req, res) => {
    try {
        const searchText = req.body.searchText;
        const articles = await Article.find({
            title: { $regex: searchText, $options: 'i' }
        }).sort({ publishDate: -1 });

        res.render('articles', {
            pageTitle: `Результаты поиска: "${searchText}"`,
            articles,
            searchType: 'title',
            searchText
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/authors', async (req, res) => {
    try {
        const authors = await Article.distinct('authors');
        res.json(authors);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/articles/search/author', async (req, res) => {
    try {
        const author = req.body.author;
        const articles = await Article.find({
            authors: author
        }).sort({ publishDate: -1 });

        res.render('articles', {
            pageTitle: `Статьи автора: ${author}`,
            articles,
            searchType: 'author',
            author
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;