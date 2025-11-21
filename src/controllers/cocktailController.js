const { AppDataSource } = require("../config/database");
const fs = require("fs");
const path = require("path");

// Obtener todos los cócteles
const getAllCocktails = async (req, res) => {
    try {
        const { search, category, ingredient } = req.query;
        
        const cocktailRepository = AppDataSource.getRepository("Cocktail");
        let query = cocktailRepository.createQueryBuilder("cocktail")
            .leftJoinAndSelect("cocktail.category", "category")
            .leftJoinAndSelect("cocktail.cocktailIngredients", "ci")
            .leftJoinAndSelect("ci.ingredient", "ingredient");

        // Filtro por búsqueda de nombre
        if (search) {
            query = query.andWhere("cocktail.name ILIKE :search", { 
                search: `%${search}%` 
            });
        }

        // Filtro por categoría
        if (category) {
            query = query.andWhere("cocktail.category_id = :category", { 
                category: parseInt(category) 
            });
        }

        // Filtro por ingrediente
        if (ingredient) {
            query = query.andWhere("ingredient.id = :ingredient", { 
                ingredient: parseInt(ingredient) 
            });
        }

        const cocktails = await query.getMany();
        res.json(cocktails);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener cócteles", 
            error: error.message 
        });
    }
};

// Obtener un cóctel por ID
const getCocktailById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cocktailRepository = AppDataSource.getRepository("Cocktail");
        const cocktail = await cocktailRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["category", "cocktailIngredients", "cocktailIngredients.ingredient"],
        });

        if (!cocktail) {
            return res.status(404).json({ message: "Cóctel no encontrado" });
        }

        res.json(cocktail);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener el cóctel", 
            error: error.message 
        });
    }
};

// Crear un nuevo cóctel
const createCocktail = async (req, res) => {
    try {
        const { name, description, instructions, category_id, ingredients } = req.body;

        // Validaciones
        if (!name || !instructions) {
            return res.status(400).json({ 
                message: "El nombre y las instrucciones son requeridos" 
            });
        }

        const cocktailRepository = AppDataSource.getRepository("Cocktail");
        const cocktailIngredientRepository = AppDataSource.getRepository("CocktailIngredient");

        // Crear el cóctel
        const cocktail = cocktailRepository.create({
            name,
            description,
            instructions,
            category: category_id ? { id: parseInt(category_id) } : null,
            image_url: req.file ? `/uploads/cocktails/${req.file.filename}` : null,
        });

        const savedCocktail = await cocktailRepository.save(cocktail);

        // Agregar ingredientes si se proporcionan
        if (ingredients && Array.isArray(ingredients)) {
            for (const ing of ingredients) {
                const cocktailIngredient = cocktailIngredientRepository.create({
                    cocktail: { id: savedCocktail.id },
                    ingredient: { id: parseInt(ing.ingredient_id) },
                    quantity: ing.quantity,
                });
                await cocktailIngredientRepository.save(cocktailIngredient);
            }
        }

        // Obtener el cóctel completo con relaciones
        const result = await cocktailRepository.findOne({
            where: { id: savedCocktail.id },
            relations: ["category", "cocktailIngredients", "cocktailIngredients.ingredient"],
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al crear el cóctel", 
            error: error.message 
        });
    }
};

// Actualizar un cóctel
const updateCocktail = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, instructions, category_id, ingredients } = req.body;

        const cocktailRepository = AppDataSource.getRepository("Cocktail");
        const cocktailIngredientRepository = AppDataSource.getRepository("CocktailIngredient");

        // Buscar el cóctel
        const cocktail = await cocktailRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!cocktail) {
            return res.status(404).json({ message: "Cóctel no encontrado" });
        }

        // Si hay nueva imagen, eliminar la anterior
        if (req.file && cocktail.image_url) {
            const oldImagePath = path.join(__dirname, "../../", cocktail.image_url);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Actualizar cocktail
        cocktail.name = name || cocktail.name;
        cocktail.description = description !== undefined ? description : cocktail.description;
        cocktail.instructions = instructions || cocktail.instructions;
        cocktail.category = category_id ? { id: parseInt(category_id) } : null;
        
        if (req.file) {
            cocktail.image_url = `/uploads/cocktails/${req.file.filename}`;
        }

        await cocktailRepository.save(cocktail);

        // Actualizar ingredientes si se proporcionan
        if (ingredients && Array.isArray(ingredients)) {
            // Eliminar ingredientes anteriores
            await cocktailIngredientRepository.delete({ cocktail: { id: parseInt(id) } });

            // Agregar nuevos ingredientes
            for (const ing of ingredients) {
                const cocktailIngredient = cocktailIngredientRepository.create({
                    cocktail: { id: parseInt(id) },
                    ingredient: { id: parseInt(ing.ingredient_id) },
                    quantity: ing.quantity,
                });
                await cocktailIngredientRepository.save(cocktailIngredient);
            }
        }

        // Obtener el cóctel actualizado con relaciones
        const result = await cocktailRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["category", "cocktailIngredients", "cocktailIngredients.ingredient"],
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al actualizar el cóctel", 
            error: error.message 
        });
    }
};

// Eliminar un cóctel
const deleteCocktail = async (req, res) => {
    try {
        const { id } = req.params;

        const cocktailRepository = AppDataSource.getRepository("Cocktail");
        const cocktail = await cocktailRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!cocktail) {
            return res.status(404).json({ message: "Cóctel no encontrado" });
        }

        // Eliminar imagen si existe
        if (cocktail.image_url) {
            const imagePath = path.join(__dirname, "../../", cocktail.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await cocktailRepository.remove(cocktail);

        res.json({ message: "Cóctel eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al eliminar el cóctel", 
            error: error.message 
        });
    }
};

module.exports = {
    getAllCocktails,
    getCocktailById,
    createCocktail,
    updateCocktail,
    deleteCocktail,
};