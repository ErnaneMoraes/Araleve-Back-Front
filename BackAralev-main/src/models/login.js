require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const crypto = require('crypto');
const { connection } = require('../../database'); // Certifique-se de que fecharConexao esteja implementado corretamente.

const router = express.Router();

router.post('/', (req, res) => {
    const { login, senha } = req.body;
    console.log(`Recebido login: ${login}, senha: ${senha}`);

    loginUser(login, senha, (err, success) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
        if (success) {
            return res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }
    });
});

function loginUser(login, senha, callback) {
    // Verifica se a conexão está aberta
    if (!connection || connection.state === 'disconnected') {
        console.error('Erro de conexão com o banco de dados');
        return callback(new Error('Erro de conexão com o banco de dados'), null);
    }

    // Executa a consulta para buscar o usuário e a senha
    connection.query(
        'SELECT SENHA, SALT FROM tb_usuario WHERE LOGIN = ?',
        [login],
        (err, results) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err);
                return callback(err, null);
            }
            if (results.length === 0) {
                console.error('Usuário não encontrado!');
                return callback(null, false); // Retorna false se não encontrar o usuário
            }

            const { SENHA: storedHash, SALT: salt } = results[0];

            // Verifica a senha
            if (verifyPassword(senha, storedHash, salt)) {
                console.log('Login bem-sucedido!');
                return callback(null, true); // Login bem-sucedido
            } else {
                console.log('Senha incorreta!');
                return callback(null, false); // Senha incorreta
            }
        }
    );
}

function verifyPassword(password, storedHash, salt) {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return storedHash === hashToVerify;
}

module.exports = router;