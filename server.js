import { bookSchema } from './book-schema';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const baseUrl = 'mongodb://localhost/book-library';

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(baseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Book model
const Book = mongoose.model('Book', bookSchema);

// CREATE - Add a new book
app.post('/books', async (req, res) => {
    const { title, author, year, genre } = req.body;
    const book = new Book({ title, author, year, genre });
    
    try {
        const savedBook = await book.save();
        res.status(201).send(savedBook);
    } catch (error) {
        res.status(400).send('Error adding book: ' + error.message);
    }
});

// READ - Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send('Error fetching books: ' + error.message);
    }
});

// READ - Get a book by ID
app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send('Error fetching book: ' + error.message);
    }
});

// UPDATE - Update a book by ID
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;
    
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { title, author, year, genre }, { new: true });
        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }
        res.status(200).send(updatedBook);
    } catch (error) {
        res.status(400).send('Error updating book: ' + error.message);
    }
});

// DELETE - Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send('Book not found');
        }
        res.status(200).send('Book deleted');
    } catch (error) {
        res.status(500).send('Error deleting book: ' + error.message);
    }
});

// Start server
const port = 3000;
const baseLocalHost = 'http://localhost'
app.listen(port, () => {
    console.log(`Server running on ${baseLocalHost}:${port}`);
});
