const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "CocktailIngredient",
    tableName: "cocktail_ingredients",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        quantity: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
    },
    relations: {
        cocktail: {
            target: "Cocktail",
            type: "many-to-one",
            joinColumn: {
                name: "cocktail_id",
            },
            nullable: false,
            onDelete: "CASCADE",
        },
        ingredient: {
            target: "Ingredient",
            type: "many-to-one",
            joinColumn: {
                name: "ingredient_id",
            },
            nullable: false,
            onDelete: "CASCADE",
        },
    },
});