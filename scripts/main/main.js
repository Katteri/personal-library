const SERVER_URL = 'http://localhost:3000/api/server-info';

fetch(SERVER_URL)
    .then(response => response.json())
    .then(data => {
        const serverInfo = document.getElementById('server-info');
        serverInfo.innerHTML = `
            <p><strong>Имя хоста</strong>: ${data.hostname}</p>
            <p><strong>Платформа</strong>: ${data.platform}</p>
            <p><strong>Архитектура</strong>: ${data.architecture}</p>
            <p><strong>Кол-во ядер</strong>: ${data.cpus.length}</p>`;
    })
    .catch(error => {
        console.error('Error fetching server info:', error);
        const serverInfo = document.getElementById('server-info');
        serverInfo.textContent = 'Не удалось загрузить информацию о сервере.';
    });

document.getElementById('author_selector').addEventListener('input', (event) => {
    const selectedValue = event.target.value;
    const authorsList = document.getElementById('authors-list');
    const matchingOption = Array.from(authorsList.options).find(option => option.value === selectedValue);

    if (matchingOption) {
        const firstName = matchingOption.getAttribute('data-first-name');
        const middleName = matchingOption.getAttribute('data-middle-name');
        const lastName = matchingOption.getAttribute('data-last-name');

        document.getElementById('author_first_name').value = firstName || '';
        document.getElementById('author_middle_name').value = middleName || '';
        document.getElementById('author_last_name').value = lastName || '';
    } else {
        document.getElementById('author_first_name').value = '';
        document.getElementById('author_middle_name').value = '';
        document.getElementById('author_last_name').value = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const greenLampButton = document.querySelector('.green-lamp_button');

    greenLampButton.addEventListener('change', (event) => {
        if (event.target.checked) {
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
    });
});

document.getElementById('open-file').addEventListener('click', (event) => { 
    window.location.href = './read.html';
  });
  