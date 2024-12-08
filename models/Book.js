import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Author from './Author.js';
import Category from './Category.js';

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reading_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['read', 'reading', 'planned']],
        },
    },
    publication_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

Book.belongsTo(Author, { foreignKey: 'author_id', onDelete: 'SET NULL' });
Book.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'SET NULL' });

export default Book;
