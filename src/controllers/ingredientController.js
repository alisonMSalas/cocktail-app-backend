const { AppDataSource } = require("../config/database");

// Obtener todos los ingredientes
const getAllIngredients = async (req, res) => {
    try {
        const ingredientRepository = AppDataSource.getRepository("Ingredient");
        const ingredients = await ingredientRepository.find();
        
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener ingredientes", 
            error: error.message 
        });
    }
};

// Crear un nuevo ingrediente
const createIngredient = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }

        const ingredientRepository = AppDataSource.getRepository("Ingredient");
        const ingredient = ingredientRepository.create({ name });
        const result = await ingredientRepository.save(ingredient);

        res.status(201).json(result);
    } catch (error) {
        if (error.code === "23505") { 
            return res.status(400).json({ message: "El ingrediente ya existe" });
        }
        res.status(500).json({ 
            message: "Error al crear ingrediente", 
            error: error.message 
        });
    }
};

module.exports = {
    getAllIngredients,
    createIngredient,
};