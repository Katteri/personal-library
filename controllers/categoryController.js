import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения категории', error });
    }
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Категория не найден' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения информации о категории', error });
    }
};