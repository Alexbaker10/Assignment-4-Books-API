const express = require('express');
const app = express();
const port = 3000;

let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    },
    {
        id: 4,
        title: "The Grapes of Wrath",
        author: "John Steinbeck",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 5,
        title: "East of Eden",
        author: "John Steinbeck",
        genre: "Fiction",
        copiesAvailable: 2
    },
    {
        id: 6,
        title: "Blood Meridian",
        author: "Cormac McCarthy",
        genre: "Fiction",
        copiesAvailable: 1
    },
    {
        id: 7,
        title: "No Country for Old Men",
        author: "Cormac McCarthy",
        genre: "Fiction",
        copiesAvailable: 6
    },
];

app.__getBooks = () => books;
app.__setBooks = (newBooks) => { books = newBooks; };

app.use(express.json());

app.get('/api/books', (req, res) => res.json(books));

app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
});

app.post('/api/books', (req, res) => {
    const newBook = req.body;
    if (!newBook.title || !newBook.author || !newBook.genre || newBook.copiesAvailable === undefined) {
        return res.status(400).json({ error: 'Missing required fields: title, author, genre, copiesAvailable' });
    }
    newBook.id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    newBook.copiesAvailable = parseInt(newBook.copiesAvailable);
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const update = req.body;
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });
    if (!update.title || !update.author || !update.genre || update.copiesAvailable === undefined) {
        return res.status(400).json({ error: 'Missing required fields: title, author, genre, copiesAvailable' });
    }
    update.copiesAvailable = parseInt(update.copiesAvailable);
    books[bookIndex] = { ...books[bookIndex], ...update };
    res.json(books[bookIndex]);
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });
    books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Book deleted successfully' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Books API server running at http://localhost:${port}`);
    });
}

module.exports = app;