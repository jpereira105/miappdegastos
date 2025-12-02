// api/categories.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;
const filePath = path.join(__dirname, 'categories.json');

let categories = fs.existsSync(filePath)
  ? JSON.parse(fs.readFileSync(filePath))
  : ["Comida", "Transporte", "Servicios", "Alquiler"];

function saveCategories() {
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
}

app.get('/categories', (req, res) => res.json(categories));

app.post('/categories', (req, res) => {
  const { name } = req.body;
  categories.push(name);
  saveCategories();
  res.json(categories);
});

app.put('/categories/:name', (req, res) => {
  const oldName = req.params.name;
  const { newName } = req.body;
  const index = categories.findIndex(c => c === oldName);
  if (index === -1) return res.status(404).json({ error: "No encontrada" });
  categories[index] = newName;
  saveCategories();
  res.json(categories);
});

app.delete('/categories/:name', (req, res) => {
  const name = req.params.name;
  categories = categories.filter(c => c !== name);
  saveCategories();
  res.json(categories);
});

app.listen(port, () => {
  console.log(`🟢 Servidor de categorías escuchando en http://localhost:${port}`);
});
