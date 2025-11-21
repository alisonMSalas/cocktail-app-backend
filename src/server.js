require("reflect-metadata");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { AppDataSource } = require("./config/database.js");
const routes = require("./routes/index.js");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// Rutas de la API
app.use("/api", routes);


// Inicializar base de datos y servidor
AppDataSource.initialize()
    .then(() => {
        console.log(" Conexión a la base de datos establecida");
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log(`API disponible en http://localhost:${PORT}/api`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar con la base de datos:", error);
    });