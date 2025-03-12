const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginUser = require('./src/models/login');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

//app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Backend rodando!');
});

app.post("/login", async (req, res) => {
  // Verificando se os dados estão no corpo da requisição
  const { LOGIN, SENHA } = req.body;
  console.log(req.body);  // Verifique o conteúdo da requisição

  try {
    const [rows] = await pool.query(
      "SELECT * FROM tb_usuario WHERE LOGIN = ? AND SENHA = ?",
      [LOGIN, SENHA]  // Certifique-se de que 'LOGIN' e 'SENHA' estão sendo passados corretamente
    );

    if (rows.length > 0) {
      res.status(200).json({ sucesso: true, mensagem: "Login efetuado com sucesso!" });
    } else {
      res.status(401).json({ sucesso: false, mensagem: "Usuário ou senha inválidos" });
    }
  } catch (err) {
    console.error("Erro na autenticação:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro no servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

