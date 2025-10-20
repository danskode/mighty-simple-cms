import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === Data variabler ===
let contentData = [];
let userData = [];

// Læs data ved opstart
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

// === Pages ===
app.get('/', (req, res) => {
    res.render('content', {
        title: 'Might Small CMS',
        contentData,
        userData
    });
});

app.get('/authors', (req, res) => {
    res.render('authors', {
        title: 'Authors',
        contentData,
        userData
    });
});

// === Server Setup ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});