document.addEventListener('DOMContentLoaded', function() {
    const volunteerForm = document.getElementById('volunteerForm');
    const errorMessages = document.getElementById('errorMessages');

    volunteerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const crp = document.getElementById('crp').value;
        const specialty = document.getElementById('specialty').value;

        fetch('/auth/registerPsychologist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                crp: crp,
                specialty: specialty
            })
        })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ status, data }) => {
            if (status === 201) {
                alert(data.message);
                window.location.reload();
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
