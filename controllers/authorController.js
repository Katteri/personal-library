import Author from '../models/Author.js';

export const getAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения авторов', error });
    }
};

export const getAuthorById = async (req, res) => {
    const { id } = req.params;
    try {
        const author = await Author.findByPk(id);
        if (!author) {
            return res.status(404).json({ message: 'Автор не найден' });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения информации об авторе', error });
    }
};
