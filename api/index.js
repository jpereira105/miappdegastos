// API/INDEX.JS 
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const categoriesRouter = require('./categories'); // importar módulo

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'transactions.json');

// Rutas principales
app.use('/categories', categoriesRouter); // montar módulo independiente
app.listen(port, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${port}`);
});


// Cargar historial desde archivo
let transactions = [];
if (fs.existsSync(filePath)) {
  transactions = JSON.parse(fs.readFileSync(filePath));
}

// Helper para guardar en archivo
function saveTransactions() {
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
}

// Listar todas
app.get('/transactions', (req, res) => {
  res.json(transactions);
});

// Buscar por ID
app.get('/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const transaction = transactions.find(t => t.transactionId === id);
  if (!transaction) return res.status(404).json({ error: 'No encontrada' });
  res.json(transaction);
});

// Crear nueva
app.post('/transactions', (req, res) => {
  const transaccion = req.body;
  transaccion.transactionId = Date.now(); // ID único
  transactions.push(transaccion);
  saveTransactions();
  res.json({ message: "Creada", transaccion });
});

// Modificar existente
app.put('/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.transactionId === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrada' });

  // Actualizar con los datos recibidos
  transactions[index] = { ...transactions[index], ...req.body, transactionId: id };
  saveTransactions();
  res.json({ message: "Modificada", transaccion: transactions[index] });
});

// Borrar existente
app.delete('/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.transactionId === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrada' });

  const deleted = transactions.splice(index, 1);
  saveTransactions();
  res.json({ message: "Eliminada", transaccion: deleted[0] });
});

app.listen(port, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${port}`);
});
