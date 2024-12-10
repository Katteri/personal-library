import Book from '../models/Book.js';
import Author from '../models/Author.js';
import Category from '../models/Category.js';

export const getBooks = async (req, res) => {
    try {
        const { category_id, author_id, reading_status } = req.query;
        const whereConditions = {};

        if (category_id) {
            whereConditions.category_id = category_id;
        }
        if (author_id) {
            whereConditions.author_id = author_id;
        }
        if (reading_status) {
            whereConditions.reading_status = reading_status;
        }

        const books = await Book.findAll({
            where: whereConditions,
            include: [Author, Category],
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

export const createBook = async (req, res) => {
    const { title, isbn, description, reading_status, publication_date, author, category } = req.body;

    try {
        // Найти или создать автора
        const [authorRecord] = await Author.findOrCreate({
            where: {
                first_name: author.first_name,
                last_name: author.last_name,
                middle_name: author.middle_name || null, // Учитываем, что middle_name может быть null
            },
        });

        // Найти или создать категорию
        const [categoryRecord] = await Category.findOrCreate({
            where: { category_name: category.category_name },
        });

        // Создать книгу с привязкой к автору и категории
        const book = await Book.create({
            title,
            isbn,
            description,
            reading_status,
            publication_date: publication_date || null,
            author_id: authorRecord.id,
            category_id: categoryRecord.id,
        });

        res.status(201).json(book);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(400).json({ message: 'Error creating book', error });
    }
};

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

export const updateBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await book.update(req.body);
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error updating book', error });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await book.destroy();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};
