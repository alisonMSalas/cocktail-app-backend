const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, //Esto crea las tablas automáticamente en la base de datos
    logging: false,
    entities: [
        "src/models/**/*.js"
    ],
    migrations: [],
    subscribers: [],
});

module.exports = { AppDataSource };