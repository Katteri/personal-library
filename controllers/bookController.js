import Book from '../models/Book.js';
import Author from '../models/Author.js';
import Category from '../models/Category.js';
import { sequelize } from '../config/database.js';

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
        res.status(500).json({ message: 'Ошибка извлечения книг', error });
    }
};

export const createBook = async (req, res) => {
    const { title, isbn, description, reading_status, publication_date, author, category } = req.body;
    const t = await sequelize.transaction();

    try {
        // Проверяем и создаём автора, если его нет
        const [authorRecord] = await Author.findOrCreate({
            where: {
                first_name: author.first_name,
                last_name: author.last_name,
                middle_name: author.middle_name || null,
            },
            defaults: {
                first_name: author.first_name,
                last_name: author.last_name,
                middle_name: author.middle_name || null,
            },
            transaction: t, // Привязка транзакции
        });

        // Проверяем и создаём категорию, если её нет
        const [categoryRecord] = await Category.findOrCreate({
            where: { category_name: category.category_name },
            defaults: { category_name: category.category_name },
            transaction: t, // Привязка транзакции
        });

        // Создаём книгу с привязкой к автору и категории
        const book = await Book.create({
            title,
            isbn,
            description,
            reading_status,
            publication_date: publication_date || null,
            author_id: authorRecord.id,
            category_id: categoryRecord.id,
        }, { transaction: t });

        await t.commit(); // Подтверждение транзакции
        res.status(201).json(book);
    } catch (error) {
        await t.rollback(); // Откат транзакции
        console.error('Ошибка создания книги:', error);
        res.status(400).json({ message: 'Ошибка создания книги', error });
    }
};

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Книга не найдена' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения книги', error });
    }
};

export const updateBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Книга не найдена' });

        await book.update(req.body);
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка редактирования записи книги', error });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Книга не найдена' });

        await book.destroy();
        res.json({ message: 'Книга успешно удалена!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления книги', error });
    }
};
