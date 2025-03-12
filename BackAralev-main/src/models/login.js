require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const { connection } = require('../../database'); // Certifique-se de que fecharConexao esteja implementado corretamente.

function loginUser(login, senha, callback) {
    if (!connection) {
        return callback(new Error('Erro de conexão com o banco de dados'), null);
    }

    // Executa a consulta para buscar o usuário e a senha
    connection.query(
        'SELECT SENHA, SALT FROM tb_usuario WHERE LOGIN = ?',
        [login],
        (err, results) => {
            if (err || results.length === 0) {
                console.error('Usuário não encontrado!');
                connection.end(); // Fecha a conexão após a consulta
                return callback(null, false); // Retorna false se não encontrar o usuário
            }

            const { SENHA: storedHash, SALT: salt } = results[0];

            // Verifica a senha
            if (verifyPassword(senha, storedHash, salt)) {
                console.log('Login bem-sucedido!');
                connection.end(); // Fecha a conexão após a consulta
                return callback(null, true); // Login bem-sucedido
            } else {
                console.log('Senha incorreta!');
                connection.end(); // Fecha a conexão após a consulta
                return callback(null, false); // Senha incorreta
            }
        }
    );
}

function verifyPassword(password, storedHash, salt) {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return storedHash === hashToVerify;
}

module.exports = { loginUser };
