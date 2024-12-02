import Author from './Author.js';
import Book from './Book.js';
import Category from './Category.js';

export const setupAssociations = () => {
    // Author -> Book
    Author.hasMany(Book, { foreignKey: 'author_id', onDelete: 'CASCADE' });
    Book.belongsTo(Author, { foreignKey: 'author_id', onDelete: 'CASCADE' });

    // Category -> Book
    Category.hasMany(Book, { foreignKey: 'category_id', onDelete: 'CASCADE' });
    Book.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });
};
