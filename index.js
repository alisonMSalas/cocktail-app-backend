const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de cócteles funcionando');
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
