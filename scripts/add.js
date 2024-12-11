const API_URL = 'http://localhost:3000/api/books';
const AUTHORS_URL = 'http://localhost:3000/api/authors';
const CATEGORIES_URL = 'http://localhost:3000/api/categories';

const statusMapping = {
    'прочитано': 'read',
    'читаю': 'reading',
    'планирую читать': 'planned',
};

function mapReadingStatus(status) {
    return statusMapping[status] || null;
}

async function populateDatalists() {
    try {
        const [authorsResponse, categoriesResponse] = await Promise.all([
            fetch(AUTHORS_URL),
            fetch(CATEGORIES_URL),
        ]);

        const [authors, categories] = await Promise.all([
            authorsResponse.json(),
            categoriesResponse.json(),
        ]);

        const authorsList = document.getElementById('authors-list');
        authorsList.innerHTML = '';
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = `${author.first_name} ${author.last_name}`;
            option.setAttribute('data-first-name', author.first_name);
            option.setAttribute('data-middle-name', author.middle_name || '');
            option.setAttribute('data-last-name', author.last_name);
            authorsList.appendChild(option);
        });

        const categoriesList = document.getElementById('categories-list');
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_name;
            categoriesList.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating datalists:', error);
    }
}

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

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const bookData = {
        isbn: form.isbn.value || null,
        title: form.title.value,
        description: form.description.value || null,
        reading_status: mapReadingStatus(form.reading_status.value),
        publication_date: form.publication_date.value,
        author: {
            first_name: form.author_first_name.value || null,
            middle_name: form.author_middle_name.value || null,
            last_name: form.author_last_name.value,
        },
        category: {
            category_name: form.category_name.value || null,
        },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        if (response.ok || response.status === 201) {
            alert('Книга успешно добавлена!');
            form.reset();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Ошибка добавления книги:', error);
    }
}

function closeForm() {
    document.getElementById('add').style.display = "none";
    document.getElementById('page').style.height = '';
    document.getElementById('page').style.overflow = 'auto';
    document.getElementById('switch').style.display = "block";
    document.form.reset();
}

document.addEventListener('DOMContentLoaded', populateDatalists);
document.getElementById('close-form').addEventListener('click', closeForm);
document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
