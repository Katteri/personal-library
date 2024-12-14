const READ_URL = 'http://localhost:3000/api/file-content';

document.getElementById('back').addEventListener('click', (event) => { 
  window.location.href = './main.html';
});

fetch(READ_URL)
    .then(response => response.json())
    .then(data => {
        const readFile = document.getElementById('read-file');
        readFile.innerHTML = `
            <p class="text text_default">${data.content}</p>`;
    })
    .catch(error => {
        console.error('Error reading file:', error);
        const serverInfo = document.getElementById('read-file');
        serverInfo.textContent = 'Не удалось прочитать данные из файла.';
    });