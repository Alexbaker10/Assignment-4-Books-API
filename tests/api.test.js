const request = require('supertest');
const app = require('../server');

const initialBooks = [
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
    }
];

describe('Books API', () => {
    beforeEach(() => {
        app.__setBooks(initialBooks.slice());
    });

    test('GET /api/books returns all books', async () => {
        const res = await request(app).get('/api/books');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
        expect(res.body[0].title).toBe('The Great Gatsby');
    });

    test('GET /api/books/:id returns a book', async () => {
        const res = await request(app).get('/api/books/1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('The Great Gatsby');
    });

    test('GET /api/books/:id returns 404 for invalid ID', async () => {
        const res = await request(app).get('/api/books/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Book not found');
    });

    test('POST /api/books creates a new book', async () => {
        const newBook = {
            title: "The Road",
            author: "Cormac McCarthy",
            genre: "Post-Apocalyptic Fiction",
            copiesAvailable: 4
        };
        const res = await request(app).post('/api/books').send(newBook);
        expect(res.status).toBe(201);
        expect(res.body.id).toBe(4);
        expect(res.body.title).toBe('The Road');
    });

    test('POST /api/books returns 400 if missing fields', async () => {
        const res = await request(app).post('/api/books').send({ title: "Invalid" });
        expect(res.status).toBe(400);
    });

    test('PUT /api/books/:id updates a book', async () => {
        const update = { title: "1984 (But Better)", author: "George Orwell",genre: "Orwellian", copiesAvailable: 10 };
        const res = await request(app).put('/api/books/3').send(update);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('1984 (But Better)');
    });

    test('PUT /api/books/:id returns 404 for invalid ID', async () => {
        const res = await request(app).put('/api/books/999').send({ title: "Ghost" });
        expect(res.status).toBe(404);
    });

    test('DELETE /api/books/:id deletes a book', async () => {
        const res = await request(app).delete('/api/books/2');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Book deleted successfully');
        const all = await request(app).get('/api/books');
        expect(all.body).toHaveLength(2);
    });

    test('DELETE /api/books/:id returns 404 for invalid ID', async () => {
        const res = await request(app).delete('/api/books/759');
        expect(res.status).toBe(404);
    });
});