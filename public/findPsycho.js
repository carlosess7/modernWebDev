// Função para lidar com o logout
function handleLogout() {
    fetch('/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/index.html';
        } else {
            console.error('Erro ao fazer logout', response.status, response.statusText);
            alert('Erro ao fazer logout');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout');
    });
}

// Adiciona o event listener ao botão após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            handleLogout();
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    fetch('/auth/checkLoginStatus')
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                const userNameElement = document.getElementById('userName');
                console.log(data.userName);
                if (userNameElement) {
                    // Exibir o nome do usuário na barra de navegação
                    userNameElement.textContent = data.userName;
                    userNameElement.classList.remove('hide-if-not-logged');
                }
            }
        })
        .catch(error => console.error('Erro ao verificar o status do login:', error));
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('/auth/psychologists')
        .then(response => response.json())
        .then(data => {
            const psychologistContainer = document.getElementById('psychologistContainer');
            data.forEach(psychologist => {
                const card = createPsychologistCard(psychologist);
                psychologistContainer.appendChild(card);
            });
        });
});

function createPsychologistCard(psychologist) {
    const card = document.createElement('div');
    card.classList.add('psychologist-card');

    const leftColumn = document.createElement('div');
    leftColumn.classList.add('left-column');

    const rightColumn = document.createElement('div');
    rightColumn.classList.add('right-column');

    const name = document.createElement('p');
    const nameText = document.createElement('span');
    nameText.textContent = 'Nome:';
    nameText.style.fontWeight = 'bold';
    const nameValue = document.createElement('span');
    nameValue.textContent = ` ${psychologist.name}`;
    name.appendChild(nameText);
    name.appendChild(nameValue);
    leftColumn.appendChild(name);

    const email = document.createElement('p');
    const emailText = document.createElement('span');
    emailText.textContent = 'Email:';
    emailText.style.fontWeight = 'bold';
    const emailValue = document.createElement('span');
    emailValue.textContent = ` ${psychologist.email}`;
    email.appendChild(emailText);
    email.appendChild(emailValue);
    leftColumn.appendChild(email);

    const phone = document.createElement('p');
    const phoneText = document.createElement('span');
    phoneText.textContent = 'Celular:';
    phoneText.style.fontWeight = 'bold';
    const phoneValue = document.createElement('span');
    phoneValue.textContent = ` ${psychologist.phone}`;
    phone.appendChild(phoneText);
    phone.appendChild(phoneValue);
    rightColumn.appendChild(phone);

    const crp = document.createElement('p');
    const crpText = document.createElement('span');
    crpText.textContent = 'CRP:';
    crpText.style.fontWeight = 'bold';
    const crpValue = document.createElement('span');
    crpValue.textContent = ` ${psychologist.crp}`;
    crp.appendChild(crpText);
    crp.appendChild(crpValue);
    rightColumn.appendChild(crp);

    const specialties = psychologist.specialty.split(';');
    const specialtyList = document.createElement('ul');
    specialtyList.classList.add('specialty-list');
    specialties.forEach(specialty => {
        if (specialty.trim() !== '') {
            const specialtyItem = document.createElement('li');
            specialtyItem.textContent = specialty.trim();
            specialtyList.appendChild(specialtyItem);
        }
    });

    const specialtyHeading = document.createElement('p');
    specialtyHeading.textContent = 'Especialidades:';
    specialtyHeading.style.fontWeight = 'bold';

    leftColumn.appendChild(specialtyHeading);
    leftColumn.appendChild(specialtyList);

    card.appendChild(leftColumn);
    card.appendChild(rightColumn);

    return card;
}

document.addEventListener('DOMContentLoaded', function() {
    // Evento de entrada no campo de busca
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        filterPsychologists(searchTerm);
    });

    // Evento de clique no botão "Limpar"
    document.getElementById('clearButton').addEventListener('click', function() {
        document.getElementById('searchInput').value = '';
        filterPsychologists('');
    });

    // Função para filtrar psicólogos com base no termo de busca
    function filterPsychologists(term) {
        const psychologistCards = document.querySelectorAll('.psychologist-card');
        let foundResults = false;
    
        psychologistCards.forEach(card => {
            const specialties = card.querySelector('.specialty-list').innerText.toLowerCase();
            if (specialties.includes(term)) {
                card.style.display = '';
                foundResults = true;
            } else {
                card.style.display = 'none';
            }
        });
    
        // Mostra ou oculta a mensagem de "Nenhum psicólogo encontrado"
        const showMessageNoPsycho = document.getElementById('showMessageNoPsycho');
        if (foundResults) {
            showMessageNoPsycho.style.display = 'none';
        } else {
            showMessageNoPsycho.style.display = 'block';
        }
    }
});