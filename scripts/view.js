const API_URL = 'http://localhost:3000/api/books';

async function fetchBooks(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        console.log('Fetching books with filters:', queryParams);
        const response = await fetch(`${API_URL}?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch books');
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function renderBooks(books) {
    console.log('Rendering books:', books);
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    if (books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <p>ISBN: ${book.isbn}</p>
            <h3>${book.title}</h3>
            <p>${book.description || 'No description'}</p>
            <p>Status: ${book.reading_status}</p>
            <p>Publication date: ${book.publication_date || 'Unknown'}</p>
            <button class="delete-btn" data-id="${book.id}">Delete</button>
        `;
        container.appendChild(bookCard);
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
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

    // Удаляем параметры с `null`, чтобы избежать пустых фильтров в запросе
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
            fetch('http://localhost:3000/api/authors'),
            fetch('http://localhost:3000/api/categories'),
        ]);

        const [authors, categories] = await Promise.all([authorsRes.json(), categoriesRes.json()]);

        const authorSelect = document.getElementById('author-filter');
        const categorySelect = document.getElementById('category-filter');

        authorSelect.innerHTML = '<option value="">All Authors</option>';
        categorySelect.innerHTML = '<option value="">All Categories</option>';

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
        console.error('Error populating filters:', error);
    }
}

populateFilters();
fetchBooks();
