const API_URL = 'http://localhost:3000/api/books';
const AUTHORS_URL = 'http://localhost:3000/api/authors';
const CATEGORIES_URL = 'http://localhost:3000/api/categories';

async function populateDatalists() {
    try {
        // Запрашиваем авторов и категории
        const [authorsResponse, categoriesResponse] = await Promise.all([
            fetch(AUTHORS_URL),
            fetch(CATEGORIES_URL),
        ]);

        const [authors, categories] = await Promise.all([
            authorsResponse.json(),
            categoriesResponse.json(),
        ]);

        // Заполняем список авторов
        const authorsList = document.getElementById('authors-list');
        authorsList.innerHTML = ''; // Очищаем список
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = `${author.first_name} ${author.last_name}`;
            option.setAttribute('data-first-name', author.first_name);
            option.setAttribute('data-middle-name', author.middle_name || ''); // Если нет middle_name, пустая строка
            option.setAttribute('data-last-name', author.last_name);
            authorsList.appendChild(option);
        });

        // Заполняем список категорий
        const categoriesList = document.getElementById('categories-list');
        categoriesList.innerHTML = ''; // Очищаем список
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_name;
            categoriesList.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating datalists:', error);
    }
}

// Обработчик выбора автора
document.getElementById('author_selector').addEventListener('input', (event) => {
    const selectedValue = event.target.value;
    const authorsList = document.getElementById('authors-list');
    const matchingOption = Array.from(authorsList.options).find(option => option.value === selectedValue);

    if (matchingOption) {
        const firstName = matchingOption.getAttribute('data-first-name');
        const middleName = matchingOption.getAttribute('data-middle-name');
        const lastName = matchingOption.getAttribute('data-last-name');

        document.getElementById('author_first_name').value = firstName || '';
        document.getElementById('author_middle_name').value = middleName || ''; // Если нет middle_name, поле остается пустым
        document.getElementById('author_last_name').value = lastName || '';
    } else {
        // Если введено новое значение, очищаем поля first_name, middle_name и last_name
        document.getElementById('author_first_name').value = '';
        document.getElementById('author_middle_name').value = '';
        document.getElementById('author_last_name').value = '';
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const bookData = {
        isbn: form.isbn.value,
        title: form.title.value,
        description: form.description.value,
        reading_status: form.reading_status.value,
        publication_date: form.publication_date.value,
        author: {
            first_name: form.author_first_name.value,
            middle_name: form.author_middle_name.value || null, // null, если поле пустое
            last_name: form.author_last_name.value,
        },
        category: {
            category_name: form.category_name.value,
        },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        if (response.ok) {
            alert('Book added/updated successfully!');
            form.reset();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error adding/updating book:', error);
    }
}

function closeForm() {
    document.getElementById('form').style.display = "none";
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', populateDatalists);
document.getElementById('close-form').addEventListener('click', closeForm);
document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
