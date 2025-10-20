import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import methodOverride from 'method-override';

// === Dummy Data ===
let contentData = [];
let userData = [];

fs.readFile(path.join(__dirname, 'data', 'contentData.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading contentData:', err);
    } else {
        contentData = JSON.parse(data);
        console.log('Content data loaded');
    }
});

fs.readFile(path.join(__dirname, 'data', 'userData.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading userData:', err);
    } else {
        userData = JSON.parse(data);
        console.log('User data loaded');
    }
});

// === App Setup ===
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(methodOverride('_method'));

// === Pages ===

app.get('/', (req, res) => {
    res.render('frontpage', {
        title: 'Welcome to Mighty Small CMS',
        contentData,
        userData
    });
});

app.get('/content', (req, res) => {
    res.render('content', {
        title: 'Mighty Small CMS',
        contentData,
        userData
    });
});

app.get('/content/:id', (req, res) => {
    const contentId = Number(req.params.id);
    const contentItem = contentData.find(item => Number(item.id) === contentId);

    if (!contentItem) {
        return res.status(404).send('Content item not found');
    }

    const contributers = userData.filter(user => contentItem.authorIds.includes(user.id.toString()));

    res.render('contentItem', {
        title: contentItem.title,
        contentItem,
        contributers
    });
});

app.delete('/content/:id', (req, res) => {
    const contentId = Number(req.params.id);

    if (!contentData.find(item => Number(item.id) === contentId)) {
        return res.status(404).send('Content item not found');
    }
    contentData = contentData.filter(item => Number(item.id) !== contentId);
    res.status(200).render('content', {
        title: 'Mighty Small CMS',
        contentData,
        userData
    });
});

app.get('/users', (req, res) => {
    res.render('users', {
        title: 'All Users',
        contentData,
        userData
    });
});

app.get('/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const user = userData.find(u => Number(u.id) === userId);

    if (!user) {
        return res.status(404).send('User not found');
    }

    const authoredContent = contentData.filter(item => item.authorIds.includes(userId.toString()));

    res.render('userProfile', {
        title: `Profile of ${user.name}`,
        user,
        authoredContent
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = Number(req.params.id);

    if (!userData.find(u => Number(u.id) === userId)) {
        return res.status(404).send('User not found');
    }
    userData = userData.filter(u => Number(u.id) !== userId);
    contentData.forEach(item => {
        item.authorIds = item.authorIds.filter(id => Number(id) !== userId);
    });
    res.status(200).render('users', {
        title: 'All Users',
        contentData,
        userData
    });
});

// === Server Setup ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});