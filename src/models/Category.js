const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Category",
    tableName: "categories",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 50,
            unique: true,
            nullable: false,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },

    },
});

