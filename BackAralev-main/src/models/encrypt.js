require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const mysql = require('mysql2');
const { connection, fecharConexao } = require('../../database');

// Função para gerar hash da senha com PBKDF2 e salt
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Gera um salt aleatório
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

// Função para registrar um novo usuário
function registerUser(nome, login, senha, nivelAcesso) {
    const { salt, hash } = hashPassword(senha);

    connection.query(
        'INSERT INTO tb_usuario (NOME, LOGIN, SENHA, SALT, NIVEL_ACESSO) VALUES (?, ?, ?, ?, ?)',
        [nome, login, hash, salt, nivelAcesso], // Agora armazenamos `salt` separadamente
        (err, results) => {
            if (err) {
                console.error('Erro ao registrar usuário:', err);
            } else {
                console.log('Usuário registrado com sucesso!');
            }            
            fecharConexao();
        }
    );
}

// Exemplo de uso:
registerUser('Ernane Moraes', 'ernane.moraes', 'Unileste', 1);

