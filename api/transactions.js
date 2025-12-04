// api/transactions.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, 'transactions.json');

let transactions = [];
if (fs.existsSync(filePath)) {
  transactions = JSON.parse(fs.readFileSync(filePath));
}

async function saveTransactions() {
  await fs.promises.writeFile(filePath, JSON.stringify(transactions, null, 2));
}

router.get('/', (req, res) => {
  res.json(transactions);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const transaction = transactions.find(t => t.transactionId === id);
  if (!transaction) return res.status(404).json({ error: 'No encontrada' });
  res.json(transaction);
});

router.post('/', async (req, res) => {
  const t = req.body;
  // Validaciones mínimas
  if (!t.transactionType || !t.transactionDescription || t.transactionAmount == null) {
    return res.status(400).json({ error: 'Campos requeridos: type, description, amount' });
  }
  t.transactionId = Date.now(); // rápido y suficiente aquí
  transactions.push(t);
  await saveTransactions();
  res.json({ message: 'Creada', transaccion: t });
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.transactionId === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrada' });

  transactions[index] = { ...transactions[index], ...req.body, transactionId: id };
  await saveTransactions();
  res.json({ message: 'Modificada', transaccion: transactions[index] });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.transactionId === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrada' });

  const deleted = transactions.splice(index, 1);
  await saveTransactions();
  res.json({ message: 'Eliminada', transaccion: deleted[0] });
});

module.exports = router;
