const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Cocktail",
    tableName: "cocktails",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        description: {
            type: "text",
            nullable: true,
        },
        instructions: {
            type: "text",
            nullable: false,
        },
        image_url: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        category: {
            target: "Category",
            type: "many-to-one",
            joinColumn: {
                name: "category_id",
            },
            nullable: true,
            onDelete: "SET NULL",
        },
        cocktailIngredients: {
            target: "CocktailIngredient",
            type: "one-to-many",
            inverseSide: "cocktail",
        },
    },
});