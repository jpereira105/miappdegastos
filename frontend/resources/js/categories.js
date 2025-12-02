// frontend/categories.js
document.addEventListener('DOMContentLoaded', () => {
  const categoryForm = document.getElementById('categoryForm');
  const categoryTable = document.getElementById('categoryTable');
  const API_CATEGORIES = 'http://localhost:4000/categories';

  function loadCategories() {
    fetch(API_CATEGORIES)
      .then(res => res.json())
      .then(data => {
        categoryTable.innerHTML = `
          <tr>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>`;
        data.forEach(cat => addCategoryToTable(cat));
      });
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
    row.insertCell().textContent = cat;

    const editCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'btn blue';
    editBtn.onclick = () => editCategory(cat);
    editCell.appendChild(editBtn);

    const deleteCell = row.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn red';
    deleteBtn.onclick = () => deleteCategory(cat);
    deleteCell.appendChild(deleteBtn);
  }

  function editCategory(oldName) {
    const newName = prompt('Nuevo nombre:', oldName);
    if (newName) {
      fetch(`${API_CATEGORIES}/${oldName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
      }).then(() => loadCategories());
    }
  }

  function deleteCategory(name) {
    fetch(`${API_CATEGORIES}/${name}`, { method: 'DELETE' })
      .then(() => loadCategories());
  }

  loadCategories();
});