require('dotenv').config();

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    }
});

connection.end((err) => {
    if (err) {
        console.error('Erro ao fechar a conexão:', err);
    } else {
        console.log('Conexão com o banco de dados fechada com sucesso!');
    }
});

//module.exports = connection;
module.exports = { connection };
