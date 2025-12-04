// frontend/categories.js

document.addEventListener('DOMContentLoaded', () => {
  const categoryForm = document.getElementById('categoryForm');
  const categoryTable = document.getElementById('categoryTable');
  const API_CATEGORIES = 'http://localhost:3000/categories';

  function loadCategories() {
  fetch(API_CATEGORIES, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache'
    },
    cache: 'no-store'
  })
    .then(res => res.json())
    .then(data => {
      console.log("Categorías cargadas:", data); // 👀 Ver en consola
      categoryTable.innerHTML = `
        <tr>
          <th>Nombre</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>`;
      data.forEach(cat => addCategoryToTable(cat));
    })
    .catch(err => console.error("Error cargando categorías:", err));
}

  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCat = categoryForm.categoryName.value;
    fetch(API_CATEGORIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCat })
    }).then(() => {
      loadCategories();
      categoryForm.reset();
    });
  });

  function addCategoryToTable(cat) {
    const row = categoryTable.insertRow();
    row.insertCell().textContent = cat.name;

    const editCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'btn blue';
    editBtn.onclick = () => editCategory(cat.id, cat.name);
    editCell.appendChild(editBtn);

    const deleteCell = row.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn red';
    deleteBtn.onclick = () => deleteCategory(cat.id);
    deleteCell.appendChild(deleteBtn);
  }

  function editCategory(id, oldName) {
    const newName = prompt('Nuevo nombre:', oldName);
    if (newName) {
      fetch(`${API_CATEGORIES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      }).then(() => loadCategories());
    }
  }

  function deleteCategory(id) {
    fetch(`${API_CATEGORIES}/${id}`, { method: 'DELETE' })
      .then(() => loadCategories());
  }

  loadCategories();
});
