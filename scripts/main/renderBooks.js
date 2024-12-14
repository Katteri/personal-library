const API_URL = 'http://localhost:3000/api/books';

const statusMapping = {
  'прочитано': 'read',
  'читаю': 'reading',
  'планирую читать': 'planned',
};

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
fetchBooks();

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
          alert('Книга успешно удалена!');
          fetchBooks(getFilterValues());
      } else {
          console.error('Error deleting books');
      }
  } catch (error) {
      console.error('Error deleting books:', error);
  }
}

function renderBooks(books) {
  const container = document.getElementById('books-container');
  container.innerHTML = '';

  if (books.length === 0) {
      container.innerHTML = '<p class="text text_book-card text_center">Такие книги не найдены.</p>';
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

document.getElementById('apply-filters').addEventListener('click', () => {
  const filters = getFilterValues();
  fetchBooks(filters);
});

document.getElementById('sort-by').addEventListener('change', () => {
  fetchBooks(getFilterValues());
});