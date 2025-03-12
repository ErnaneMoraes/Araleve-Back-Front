const express = require('express');
const bodyParser = require('body-parser');
//const routes = require('./src/routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

//app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Backend rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

