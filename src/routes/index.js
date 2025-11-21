const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads.js");


const cocktailController = require("../controllers/cocktailController");
const categoryController = require("../controllers/categoryController");
const ingredientController = require("../controllers/ingredientController");

//Obtener todos los cócteles
router.get("/cocktails", cocktailController.getAllCocktails);

// Obtener un cóctel por ID
router.get("/cocktails/:id", cocktailController.getCocktailById);

// Crear un nuevo cóctel 
router.post("/cocktails", upload.single("image"), cocktailController.createCocktail);

// Actualizar un cóctel 
router.put("/cocktails/:id", upload.single("image"), cocktailController.updateCocktail);

// Eliminar un cóctel
router.delete("/cocktails/:id", cocktailController.deleteCocktail);


// Obtener todas las categorías
router.get("/categories", categoryController.getAllCategories);

// Crear una nueva categoría
router.post("/categories", categoryController.createCategory);


// Obtener todos los ingredientes
router.get("/ingredients", ingredientController.getAllIngredients);

// Crear un nuevo ingrediente
router.post("/ingredients", ingredientController.createIngredient);

module.exports = router;