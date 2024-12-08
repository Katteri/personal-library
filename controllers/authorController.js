import Author from '../models/Author.js';

export const getAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching authors', error });
    }
};
