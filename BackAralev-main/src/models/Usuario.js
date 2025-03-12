const connection = require('../../database');

class Usuario {
    constructor(idUsuario, nome, login, senha, nivelAcesso) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.nivelAcesso = nivelAcesso;
    }

    static validarLoginExistente(login, listaUsuarios) {
        const loginExistente = listaUsuarios.some(usuario => usuario.login === login);
        if (loginExistente) {
            this.exibirAlerta(`O login "${login}" já está em uso. Por favor, escolha outro login.`);
        }
        return loginExistente;
    }

    static exibirAlerta(mensagem) {
        console.warn('ALERTA:', mensagem);
    }

    criarUsuario(nome, login, senha, nivelAcesso) {
        const query = 'INSERT INTO tb_usuario (nome, login, senha, nivel_acesso) VALUES (?, ?, ?, ?)';
        connection.query(query, [nome, login, senha, nivelAcesso], (err, results) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
            }
            console.log('Id do usuário criado:', results.insertId);
        });
    }

    autenticarUsuario(login, senha) {
        if (this.login === login && this.senha === senha) {
            console.log('Usuário autenticado com sucesso!');
            return true;
        } else {
            console.log('Login ou senha incorretos.');
            return false;
        }
    }

    definirPermissoes() {
        switch (this.nivelAcesso) {
            case 'admin':
                console.log('Permissões de administrador: Acesso total ao sistema.');
                break;
            case 'editor':
                console.log('Permissões de editor: Pode editar conteúdo, mas não pode administrar usuários.');
                break;
            case 'visitante':
                console.log('Permissões de visitante: Apenas leitura.');
                break;
            default:
                console.log('Nível de acesso desconhecido. Permissões não definidas.');
        }
    }
}

module.exports = Usuario;