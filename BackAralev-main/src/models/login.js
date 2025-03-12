require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const mysql = require('mysql2');
const { connection, fecharConexao } = require('../../database');

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
            fecharConexao();
        }
    );
}

function verifyPassword(password, storedHash, salt) {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return storedHash === hashToVerify;
}

loginUser('ernane.moraes', 'Unileste');