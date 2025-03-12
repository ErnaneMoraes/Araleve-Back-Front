const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { loginUser } = require('./src/models/Login'); // Certifique-se do caminho correto

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend rodando!');
});

// Transformando loginUser em uma Promise
const loginUserPromise = (LOGIN, SENHA) => {
  return new Promise((resolve, reject) => {
    loginUser(LOGIN, SENHA, (err, sucesso) => {
      if (err) {
        reject('Erro no servidor');
      }
      resolve(sucesso);
    });
  });
};

app.post('/login', async (req, res) => {
  const { LOGIN, SENHA } = req.body;
  
  if (!LOGIN || !SENHA) {
    return res.status(400).json({ sucesso: false, mensagem: 'Usuário e senha são obrigatórios!' });
  }

  try {
    const sucesso = await loginUserPromise(LOGIN, SENHA);
    if (sucesso) {
      return res.status(200).json({ sucesso: true, mensagem: 'Login efetuado com sucesso!' });
    } else {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ sucesso: false, mensagem: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta 127.0.0.1:${PORT}`);
});
