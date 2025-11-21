const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Ingredient",
    tableName: "ingredients",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            unique: true,
            nullable: false,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
    },
});