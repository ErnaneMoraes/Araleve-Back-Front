require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const mysql = require('mysql2');

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Função para gerar hash da senha com PBKDF2 e salt
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Gera um salt aleatório
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

// Função para verificar a senha informada no login
function verifyPassword(password, storedHash, salt) {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return storedHash === hashToVerify;
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
        }
    );
}

// Função para login do usuário
function loginUser(login, senha) {
    connection.query(
        'SELECT SENHA, SALT FROM tb_usuario WHERE LOGIN = ?',
        [login],
        (err, results) => {
            if (err || results.length === 0) {
                console.error('Usuário não encontrado!');
                return;
            }

            const { SENHA: storedHash, SALT: salt } = results[0];

            if (verifyPassword(senha, storedHash, salt)) {
                console.log('Login bem-sucedido!');
            } else {
                console.log('Senha incorreta!');
            }
        }
    );
}

// Exemplo de uso:
registerUser('Ernane Moraes', 'ernane.moraes', 'Unileste', 1);

// Testando login após um pequeno delay para garantir que o registro foi feito
setTimeout(() => {
    loginUser('ernane.moraes', 'Unileste'); // Deve ser sucesso
    loginUser('ernane.moraes', 'Unileste'); // Deve falhar
}, 3000);
