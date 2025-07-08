const express = require('express')
const cors = require('cors')

const app = express();
app.use(cors())

const port = 3000

const transactions = [ 
  {
    "transactionType": "Ingreso",
    "transactionDescription": "Alfajores",
    "transactionAmount": "20",
    "transactionCategory": "Comida",
    "transactionId": 5

  },
  {
    "transactionType": "Egreso",
    "transactionDescription": "Alquiler",
    "transactionAmount": "5000",
    "transactionCategory": "Alquiler",
    "transactionId": 6

  },
  {
    "transactionType": "Egreso",
    "transactionDescription": "Alquiler",
    "transactionAmount": "15000",
    "transactionCategory": "Alquiler",
    "transactionId": 7

  }
]

app.get('/', (req, res) => {
  res.send(`ok, ingresaron a localhost! ${port}`)
})

app.get('/transactions', (req, res) => {
    res.send(transactions)
})

app.get('/transactions/:id', (req, res) => {
  const transaccionId = req.params.id
  const selectedTransaction = transactions.filter(transaction => transaction.transaccionId.id == transaccionId)
  res.send(selectedTransaction)
})
app.post('/transactions', (req, res) => {
    //obteneme la transaccion que viene en la request
    //guardala en una variable llamada transaction
    const transaccion = "aca va la transaction que me vino";
    transactions.push(transaccion)
    res.send("todo ok")
    //y guardala en el array global
    //responde que fue hecho :D
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



