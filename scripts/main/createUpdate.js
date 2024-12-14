function mapReadingStatus(status) {
  return statusMapping[status] || null;
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const bookData = {
      isbn: form.isbn.value || null,
      title: form.title.value.trim(),
      description: form.description.value.trim() || null,
      reading_status: mapReadingStatus(form.reading_status.value),
      publication_date: form.publication_date.value,
      author: {
          first_name: form.author_first_name.value.trim() || null,
          middle_name: form.author_middle_name.value.trim() || null,
          last_name: form.author_last_name.value.trim(),
      },
      category: {
          category_name: form.category_name.value.trim() || null,
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

async function handleUpdateBook(event) {
  event.preventDefault();
  const form = event.target;

  const bookId = form.dataset.bookId;
  if (!bookId) return;

  const bookData = {
      isbn: form.isbn.value || null,
      title: form.title.value.trim(),
      description: form.description.value.trim() || null,
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
          console.error('Error updating book:', errorData.message);
      }
  } catch (error) {
      console.error('Error updating book:', error);
  }
}

async function openUpdateForm(bookId) {
  try {
      const response = await fetch(`${API_URL}/${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch book');
      const book = await response.json();

      const resAuthor = await fetch(`${AUTHORS_URL}/${book.author_id}`);
      if (!resAuthor.ok) throw new Error('Failed to fetch author');
      const author = await resAuthor.json();

      const resCategory = await fetch(`${CATEGORIES_URL}/${book.category_id}`);
      if (!resCategory.ok) throw new Error('Failed to fetch category');
      const category = await resCategory.json();

      document.getElementById('add').style.display = "block";
      document.getElementById('page').style.height = '100vh';
      document.getElementById('page').style.overflow = 'hidden';
      document.getElementById('form').style.background = "linear-gradient(#efa078, #935727)";
      document.getElementById('switch').style.display = "none";

      document.getElementById('form-header').textContent = 'Редактирование';
      document.getElementById('isbn').value = book.isbn || '';
      document.getElementById('isbn').placeholder = "";
      document.getElementById('title').value = book.title;
      document.getElementById('title').placeholder = "";
      document.getElementById('description').value = book.description || '';
      document.getElementById('description').placeholder = "";
      document.getElementById('reading_status').value = Object.keys(statusMapping).find(
          key => statusMapping[key] === book.reading_status
      ) || '';
      document.getElementById('publication_date').value = book.publication_date.slice(0, 7);
      document.getElementById('category_name').value = category.category_name;
      document.getElementById('category_name').setAttribute("readonly", "readonly");
      document.getElementById('category_name').style.color = 'grey';
      document.getElementById('category_name').placeholder = "";
      document.getElementById('category_name').style.cursor = "default";
      document.getElementById('author_selector').value = `${author.first_name} ${author.last_name}`;
      document.getElementById('author_selector').setAttribute("readonly", "readonly");
      document.getElementById('author_selector').style.color = 'grey';
      document.getElementById('author_selector').placeholder = "";
      document.getElementById('author_selector').style.cursor = "default";
      document.getElementById('author_first_name').value = author.first_name;
      document.getElementById('author_first_name').setAttribute("readonly", "readonly");
      document.getElementById('author_first_name').style.color = 'grey';
      document.getElementById('author_first_name').placeholder = "";
      document.getElementById('author_first_name').style.cursor = "default";
      document.getElementById('author_middle_name').value = author.middle_name || '';
      document.getElementById('author_middle_name').setAttribute("readonly", "readonly");
      document.getElementById('author_middle_name').style.color = 'grey';
      document.getElementById('author_middle_name').placeholder = "";
      document.getElementById('author_middle_name').style.cursor = "default";
      document.getElementById('author_last_name').value = author.last_name;
      document.getElementById('author_last_name').setAttribute("readonly", "readonly");
      document.getElementById('author_last_name').style.color = 'grey';
      document.getElementById('author_last_name').placeholder = "";
      document.getElementById('author_last_name').style.cursor = "default";
      document.getElementById('form-submit').textContent = 'готово';
      document.getElementById('book-form').dataset.bookId = book.id;
  } catch (error) {
      console.error('Error open update form:', error);
  }
}

function openForm() {
  document.getElementById('add').style.display = "block";
  document.getElementById('page').style.height = '100vh';
  document.getElementById('page').style.overflow = 'hidden';
  document.getElementById('form').style.background = "linear-gradient(#e2787d, #9c0b0a)";
  document.getElementById('switch').style.display = "none";
  document.getElementById('form-header').textContent = 'Новая книга';
  document.getElementById('isbn').placeholder = '978-5-389-06256-6';
  document.getElementById('title').placeholder = "Война и мир";
  document.getElementById('description').placeholder = "Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805—1812 годах.";
  document.getElementById('publication_date').value = "1867-01";
  document.getElementById('category_name').placeholder = 'Роман';
  document.getElementById('author_selector').placeholder = "Лев Николаевич Толстой";
  document.getElementById('author_first_name').placeholder = "Лев";
  document.getElementById('author_middle_name').placeholder = "Николаевич";
  document.getElementById('author_last_name').placeholder = "Толстой";
  document.getElementById('form-submit').textContent = 'добавить книгу';
}

function closeForm() {
  document.getElementById('add').style.display = "none";
  document.getElementById('page').style.height = '';
  document.getElementById('page').style.overflow = 'auto';
  document.getElementById('switch').style.display = "block";
  document.form.reset();
}


document.getElementById('book-form').addEventListener('submit', (event) => {
  if (event.target.dataset.bookId) {
      handleUpdateBook(event);
  } else {
      handleFormSubmit(event);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('books-container').addEventListener('click', (event) => {
      if (event.target.classList.contains('button_update')) {
          const bookId = event.target.closest('.button_update').dataset.id;
          openUpdateForm(bookId);
      }
  });
});

document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
document.getElementById('close-form').addEventListener('click', closeForm);
document.getElementById('open-form').addEventListener('click', openForm);