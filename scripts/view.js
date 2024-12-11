function getReadingStatus(value) {
    const key = Object.keys(statusMapping).find(k => statusMapping[k] === value);
    return key;
}

function formatDate(sqliteDate) {
    const months = [
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ];

    const date = new Date(sqliteDate);

    if (isNaN(date)) {
        console.error('Invalid date format');
        return null;
    }

    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${monthName} ${year}`;
}

function sortBooks(books, criteria) {
    switch (criteria) {
        case 'author':
            return books.sort((a, b) => {
                const authorA = a.Author ? a.Author.last_name : '';
                const authorB = b.Author ? b.Author.last_name : '';
                return authorA.localeCompare(authorB);
            });
        case 'category':
            return books.sort((a, b) => {
                const categoryA = a.Category ? a.Category.category_name : '';
                const categoryB = b.Category ? b.Category.category_name : '';
                return categoryA.localeCompare(categoryB);
            });
        case 'title':
            return books.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return books;
    }
}

async function fetchBooks(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch books');
        let books = await response.json();
        
        const sortBy = document.getElementById('sort-by').value;
        books = sortBooks(books, sortBy);

        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function renderBooks(books) {
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    if (books.length === 0) {
        container.innerHTML = '<p class="text text_book-card">Такие книги не найдены.</p>';
        return;
    }

    books.forEach(book => {
        const authorName = book.Author 
            ? `${book.Author.first_name} ${book.Author.middle_name || ''} ${book.Author.last_name}`.trim()
            : 'Автор неизвестен';
        const categoryName = book.Category 
            ? book.Category.category_name 
            : 'Жанр не указан';

        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class=text_book-card>
                <h3 class="text text_book-card book-card__heading">${book.title}</h3>
                <p class="text text_book-card text_footnote">ISBN: ${book.isbn || 'не найден'}</p>
            </div>
            <p class="text text_book-card">${authorName}</p>
            <p class="text text_book-card">${categoryName}</p>
            <p class="text text_book-card">${book.description || 'Нет описания'}</p>
            <p class="text text_book-card">Дата публикации: ${(book.publication_date)? formatDate(book.publication_date.slice(0, 10)) : 'не указана'}</p>
            <div class="book-card_bottom">
                <p class="text text_book-card text_right">${getReadingStatus(book.reading_status).toUpperCase()}</p>
                <div id="book-card__buttons" class="book-card__buttons">
                    <button class="button button_delete text" data-id="${book.id}">удалить</button>
                    <button class="button button_update text" data-id=${book.id}>редактировать</button>
                </div>
            </div>
        `;
        container.appendChild(bookCard);
    });

    const deleteButtons = document.querySelectorAll('.button_delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => deleteBook(button.dataset.id));
    });
}

function getFilterValues() {
    const filters = {
        category_id: document.getElementById('category-filter').value || null,
        author_id: document.getElementById('author-filter').value || null,
        reading_status: document.getElementById('status-filter').value || null,
    };

    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });

    return filters;
}

async function deleteBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Book deleted successfully');
            fetchBooks(getFilterValues());
        } else {
            console.error('Error deleting book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

document.getElementById('apply-filters').addEventListener('click', () => {
    const filters = getFilterValues();
    fetchBooks(filters);
});

async function populateFilters() {
    try {
        const [authorsRes, categoriesRes] = await Promise.all([
            fetch(AUTHORS_URL),
            fetch(CATEGORIES_URL),
        ]);

        const [authors, categories] = await Promise.all([authorsRes.json(), categoriesRes.json()]);

        const authorSelect = document.getElementById('author-filter');
        const categorySelect = document.getElementById('category-filter');

        authorSelect.innerHTML = '<option value="">Все авторы</option>';
        categorySelect.innerHTML = '<option value="">Все категории</option>';

        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.id;
            option.textContent = `${author.first_name} ${author.last_name}`;
            authorSelect.appendChild(option);
        });

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка заполнения фильтров:', error);
    }
}

function openForm() {
    document.getElementById('add').style.display = "block";
    document.getElementById('page').style.height = '100vh';
    document.getElementById('page').style.overflow = 'hidden';
    document.getElementById('form').style.background = "linear-gradient(#e2787d, #9c0b0a)";
    document.getElementById('switch').style.display = "none";
    document.getElementById('form-header').textContent = 'Новая книга';
    document.getElementById('isbn').ariaPlaceholder = '978-5-389-06256-6';
    document.getElementById('title').ariaPlaceholder = "Война и мир";
    document.getElementById('description').ariaPlaceholder = "Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805—1812 годах.";
    document.getElementById('publication_date').value = "1867-01";
    document.getElementById('category_name').ariaPlaceholder = 'Роман';
    document.getElementById('author_selector').ariaPlaceholder = "Лев Николаевич Толстой";
    document.getElementById('author_first_name').ariaPlaceholder = "Лев";
    document.getElementById('author_middle_name').ariaPlaceholder = "Николаевич";
    document.getElementById('author_last_name').ariaPlaceholder = "Толстой";
    document.getElementById('form-submit').textContent = 'добавить книгу';
}

// Открыть форму с заполнением существующих данных
async function openUpdateForm(bookId) {
    try {
        // Запросить данные книги по ID
        const response = await fetch(`${API_URL}/${bookId}`);
        if (!response.ok) throw new Error('Ошибка получения информации о книги');
        const book = await response.json();

        const resAuthor = await fetch(`${AUTHORS_URL}/${book.author_id}`);
        if (!resAuthor.ok) throw new Error('Ошибка получения информации об авторе');
        const author = await resAuthor.json();

        const resCategory = await fetch(`${CATEGORIES_URL}/${book.category_id}`);
        if (!resCategory.ok) throw new Error('Ошибка получения информации об авторе');
        const category = await resCategory.json();

        // Открыть форму
        document.getElementById('add').style.display = "block";
        document.getElementById('page').style.height = '100vh';
        document.getElementById('page').style.overflow = 'hidden';
        document.getElementById('form').style.background = "linear-gradient(#efa078, #935727)";
        document.getElementById('switch').style.display = "none";

        // Заполнить форму данными книги
        document.getElementById('form-header').textContent = 'Редактирование';
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('title').value = book.title;
        document.getElementById('description').value = book.description || '';
        document.getElementById('reading_status').value = Object.keys(statusMapping).find(
            key => statusMapping[key] === book.reading_status
        ) || '';
        document.getElementById('publication_date').value = book.publication_date.slice(0, 7);
        document.getElementById('category_name').value = category.category_name;
        document.getElementById('category_name').setAttribute("readonly", "readonly");
        document.getElementById('category_name').style.color = 'grey';
        document.getElementById('author_selector').value = `${author.first_name} ${author.last_name}`;
        document.getElementById('author_selector').setAttribute("readonly", "readonly");
        document.getElementById('author_selector').style.color = 'grey';
        document.getElementById('author_first_name').value = author.first_name;
        document.getElementById('author_first_name').setAttribute("readonly", "readonly");
        document.getElementById('author_first_name').style.color = 'grey';
        document.getElementById('author_middle_name').value = author.middle_name || '';
        document.getElementById('author_middle_name').setAttribute("readonly", "readonly");
        document.getElementById('author_middle_name').style.color = 'grey';
        document.getElementById('author_last_name').value = author.last_name;
        document.getElementById('author_last_name').setAttribute("readonly", "readonly");
        document.getElementById('author_last_name').style.color = 'grey';
        document.getElementById('form-submit').textContent = 'готово';
        // Сохранение ID редактируемой книги для дальнейшего использования
        document.getElementById('book-form').dataset.bookId = book.id;
    } catch (error) {
        console.error('Ошибка открытия формы редактирования:', error);
    }
}

// Обновление книги
async function handleUpdateBook(event) {
    event.preventDefault();
    const form = event.target;

    const bookId = form.dataset.bookId;
    if (!bookId) return; // Если ID отсутствует, это новая книга, а не редактирование

    const bookData = {
        isbn: form.isbn.value || null,
        title: form.title.value,
        description: form.description.value || null,
        reading_status: mapReadingStatus(form.reading_status.value),
        publication_date: form.publication_date.value,
    };

    try {
        const response = await fetch(`${API_URL}/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        if (response.ok) {
            alert('Книга успешно обновлена!');
            form.reset();
            closeForm();
            fetchBooks(getFilterValues());
        } else {
            const errorData = await response.json();
            console.error('Ошибка обновления:', errorData.message);
        }
    } catch (error) {
        console.error('Ошибка при обновлении книги:', error);
    }
}

// Добавляем обработчик на кнопки "обновить"
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('books-container').addEventListener('click', (event) => {
        if (event.target.classList.contains('button_update')) {
            const bookId = event.target.closest('.button_update').dataset.id;
            openUpdateForm(bookId);
        }
    });
});

// Переопределяем обработчик формы для обработки обновлений
document.getElementById('book-form').addEventListener('submit', (event) => {
    if (event.target.dataset.bookId) {
        handleUpdateBook(event);
    } else {
        handleFormSubmit(event);
    }
});

populateFilters();
fetchBooks();

document.getElementById('sort-by').addEventListener('change', () => {
    fetchBooks(getFilterValues());
});
document.getElementById('open-form').addEventListener('click', openForm);


document.addEventListener('DOMContentLoaded', () => {
    const greenLampButton = document.querySelector('.green-lamp_button');
  
    greenLampButton.addEventListener('change', (event) => {
        if (event.target.checked) {
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1000);
        }
    });
  });