const AUTHORS_URL = 'http://localhost:3000/api/authors';
const CATEGORIES_URL = 'http://localhost:3000/api/categories';

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
      console.error('Error populating filters:', error);
  }
}
populateFilters();

document.addEventListener('DOMContentLoaded', populateDatalists);