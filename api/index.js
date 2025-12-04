// API/INDEX.JS 

const express = require('express');
const cors = require('cors');

const categoriesRouter = require('./categories');
const transactionsRouter = require('./transactions');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/categories', categoriesRouter);
app.use('/transactions', transactionsRouter);

app.listen(port, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${port}`);
});
