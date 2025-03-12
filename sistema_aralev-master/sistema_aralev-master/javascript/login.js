document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente carregado.");

    // Seleciona o formulário de login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const usuario = document.querySelector("input[name='usuario']").value.trim();
            const senha = document.querySelector("input[name='senha']").value.trim();

            if (!usuario || !senha) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            try {
                const response = await fetch("127.0.0.1:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ LOGIN: usuario, SENHA: senha })
                });

                const data = await response.json();
                console.log("Resposta da API:", data);

                if (response.ok && data.sucesso) {
                    alert(data.mensagem);
                    window.location.href = "inicio.html";
                } else {
                    alert("Erro: " + data.mensagem);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
            }
        });
    } else {
        console.error("Elemento #loginForm não encontrado. Verifique se o ID está correto.");
    }

});
