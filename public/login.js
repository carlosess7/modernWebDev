document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    handleLoginError(data.errorCode);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = '/findPsycho.html';
            }
        })
        .catch(error => {
            console.error('Erro:', error.message);
        });
    });
});

function handleLoginError(errorCode) {
    switch (errorCode) {
        case 'missingFields':
            alert('Por favor, preencha todos os campos.');
            break;
        case 'invalidEmail':
            alert('Email incorreto. Verifique seu email e tente novamente.');
            break;
        case 'invalidPassword':
            alert('Senha incorreta. Verifique sua senha e tente novamente.');
            break;
        case 'serverError':
            alert('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.');
            break;
        case 'sessionError':
            alert('Erro ao inicializar a sessão. Por favor, tente novamente mais tarde.');
            break;
        default:
            alert('Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.');
            break;
    }
}