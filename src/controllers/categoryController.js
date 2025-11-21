const { AppDataSource } = require("../config/database");

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
    try {
        const categoryRepository = AppDataSource.getRepository("Category");
        const categories = await categoryRepository.find();
        
        res.json(categories);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener categorías", 
            error: error.message 
        });
    }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }

        const categoryRepository = AppDataSource.getRepository("Category");
        const category = categoryRepository.create({ name });
        const result = await categoryRepository.save(category);

        res.status(201).json(result);
    } catch (error) {
        if (error.code === "23505") { 
            return res.status(400).json({ message: "La categoría ya existe" });
        }
        res.status(500).json({ 
            message: "Error al crear categoría", 
            error: error.message 
        });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
};