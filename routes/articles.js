const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Научный журнал',
        showTopArticles: true,
        showDateSearch: true
    });
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

// Маршрут для создания статьи (форма)
router.get('/articles/new', (req, res) => {
    res.render('article-form', {
        pageTitle: 'Создать новую статью'
    });
});

// Маршрут для топ статей
router.get('/articles/top', async (req, res) => {
    try {
        const articles = await Article.aggregate([
            {
                $addFields: {
                    avgRating: { $avg: "$reviews.rating" },
                    reviewsCount: { $size: "$reviews" }
                }
            },
            { $sort: { avgRating: -1, reviewsCount: -1 } },
            { $limit: 5 }
        ]);

        res.render('articles', {
            pageTitle: 'Топ статей',
            articles,
            searchType: 'top'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для поиска по дате
router.post('/articles/search/date', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const articles = await Article.find({
            publishDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ publishDate: -1 });

        res.render('articles', {
            pageTitle: `Статьи с ${new Date(startDate).toLocaleDateString()} по ${new Date(endDate).toLocaleDateString()}`,
            articles,
            searchType: 'date',
            startDate,
            endDate
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Статья не найдена');
        }
        res.render('article-detail', {
            pageTitle: article.title,
            article
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для удаления статьи
router.get('/articles/:id/delete', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/articles');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для обработки создания статьи
router.post('/articles', async (req, res) => {
    try {
        const { title, authors, content, tags } = req.body;
        const newArticle = new Article({
            title,
            authors: authors.split(',').map(a => a.trim()),
            content,
            tags: tags.split(',').map(t => t.trim())
        });
        await newArticle.save();
        res.redirect('/articles');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;