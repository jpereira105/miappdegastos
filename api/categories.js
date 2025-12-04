// api/categories.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, 'categories.json');

// 🔹 Cargar categorías desde archivo
let categories = [];
if (fs.existsSync(filePath)) {
  categories = JSON.parse(fs.readFileSync(filePath));

  // 🔹 Normalizar: si hay strings, convertirlos a objetos { id, name }
  if (Array.isArray(categories) && categories.length > 0 && typeof categories[0] === "string") {
    categories = categories.map((name, index) => ({
      id: index + 1,
      name
    }));
    // Guardar ya normalizado
    fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
  }
}

// 🔹 Guardar categorías en archivo
async function saveCategories() {
  await fs.promises.writeFile(filePath, JSON.stringify(categories, null, 2));
}

// 🔹 Obtener el próximo ID disponible
function getNextId() {
  return categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
}

// --- CRUD ---
// Listar todas
router.get('/', (req, res) => {
  res.json(categories);
});

// Crear nueva
router.post('/', async (req, res) => {
  const name = (req.body?.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });

  const category = { id: getNextId(), name };
  categories.push(category);
  await saveCategories();
  res.json({ message: "Creada", category });
});

// Modificar existente
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrada' });

  const name = (req.body?.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });

  categories[index].name = name;
  await saveCategories();
  res.json({ message: "Modificada", category: categories[index] });
});

// Borrar existente
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrada' });

  const deleted = categories.splice(index, 1);
  await saveCategories();
  res.json({ message: "Eliminada", category: deleted[0] });
});

module.exports = router;
