document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response content type:', response.headers.get('content-type'));
            return response.json().then(data => ({ status: response.status, data }));
        })
        .then(({ status, data }) => {
            console.log('Response data:', data);
            if (status === 200) {
                alert(data.message);
                window.location.href = '/login.html';
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error.message);
            alert('Ocorreu um erro ao processar o registro. Por favor, tente novamente mais tarde.');
        });
    });
});
