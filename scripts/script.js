const mongoose = require('mongoose');
const Article = require('../models/Article');

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/science_journal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    // Очистка коллекции
    await Article.deleteMany({});

    // Создание тестовых данных
    const articles = [
        {
            title: "Квантовые вычисления: будущее уже здесь",
            authors: ["Иван Петров", "Мария Сидорова"],
            content: "Статья о перспективах квантовых вычислений...",
            tags: ["квантовые технологии", "физика", "компьютеры"],
            reviews: [
                { name: "Алексей", text: "Отличная статья!", rating: 9 },
                { name: "Дмитрий", text: "Можно было подробнее", rating: 7 }
            ]
        },
        {
            title: "Искусственный интеллект в медицине",
            authors: ["Елена Иванова"],
            content: "Применение ИИ для диагностики заболеваний...",
            tags: ["искусственный интеллект", "медицина"],
            reviews: [
                { name: "Ольга", text: "Очень актуально", rating: 10 }
            ]
        },
        {
            title: "Новые материалы в нанотехнологиях",
            authors: ["Александр Смирнов", "Наталья Кузнецова"],
            content: "Обзор современных наноматериалов...",
            tags: ["нанотехнологии", "материаловедение"],
            reviews: []
        },
        {
            title: "Климатические изменения и экология",
            authors: ["Дмитрий Волков"],
            content: "Анализ влияния человеческой деятельности...",
            tags: ["экология", "климат"],
            reviews: [
                { name: "Сергей", text: "Важная тема", rating: 8 },
                { name: "Анна", text: "Не хватает конкретных решений", rating: 6 }
            ]
        },
        {
            title: "Биоинформатика и геномика",
            authors: ["Мария Сидорова", "Андрей Павлов"],
            content: "Методы анализа геномных данных...",
            tags: ["биоинформатика", "генетика"],
            reviews: [
                { name: "Михаил", text: "Сложно, но интересно", rating: 8 }
            ]
        }
    ];

    try {
        await Article.insertMany(articles);
        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
});