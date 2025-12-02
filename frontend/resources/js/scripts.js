// frontend/scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transactionForm');
  const table = document.getElementById('transactionTable');
  const categorySelect = document.getElementById('transactionCategory');
  const API_URL = 'http://localhost:3000/transactions'; // cambia a tu URL en Render

  const API_CATEGORIES = 'http://localhost:3000/categories';

  // --- 🔹 CRUD de Categorías ---
  const categoryForm = document.getElementById('categoryForm');
  const categoryTable = document.getElementById('categoryTable');

  // Cargar categorías
  function loadCategories() {
    fetch(API_CATEGORIES)
      .then(res => res.json())
      .then(data => {
        // Poblar select
        categorySelect.innerHTML = "";
        data.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat;
          option.textContent = cat;
          categorySelect.appendChild(option);
        });

        // Poblar tabla
        categoryTable.innerHTML = `
          <tr>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>`;
        data.forEach(cat => addCategoryToTable(cat));
      });
  }

  // Crear categoría
  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCat = categoryForm.categoryName.value;

    fetch(API_CATEGORIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCat })
    })
    .then(res => res.json())
    .then(() => {
      console.log('🟢 Categoría creada');
      loadCategories();
      categoryForm.reset();
    });
  });

  // Helper para tabla
  function addCategoryToTable(cat) {
    const row = categoryTable.insertRow();
    row.insertCell().textContent = cat;

    // Editar
    const editCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'btn blue';
    editBtn.onclick = () => editCategory(cat);
    editCell.appendChild(editBtn);

    // Eliminar
    const deleteCell = row.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn red';
    deleteBtn.onclick = () => deleteCategory(cat);
    deleteCell.appendChild(deleteBtn);
  }

  // Editar categoría
  function editCategory(oldName) {
    const newName = prompt('Nuevo nombre:', oldName);
    if (newName) {
      fetch(`${API_CATEGORIES}/${oldName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
      })
      .then(res => res.json())
      .then(() => {
        console.log('🟡 Categoría modificada');
        loadCategories();
      });
    }
  }

  // Borrar categoría
  function deleteCategory(name) {
    fetch(`${API_CATEGORIES}/${name}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        console.log('🔴 Categoría eliminada');
        loadCategories();
      });
  }

  

  // Inicializar categorías
  loadCategories();
  // Cargar transacciones iniciales
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      data.forEach(addTransactionToTable);
    });

  // Crear nueva transacción
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaccion = {
      transactionType: form.transactionType.value,
      transactionDescription: form.transactionDescription.value,
      transactionAmount: form.transactionAmount.value,
      transactionCategory: form.transactionCategory.value
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaccion)
    })
    .then(res => res.json())
    .then(data => {
      console.log('🟢 Creada:', data);
      addTransactionToTable(data.transaccion);
    });
  });

  // Helper para agregar fila con botones
  function addTransactionToTable(t) {
    const row = table.insertRow();
    row.dataset.id = t.transactionId;

    row.insertCell().textContent = t.transactionType;
    row.insertCell().textContent = t.transactionDescription;
    row.insertCell().textContent = t.transactionAmount;
    row.insertCell().textContent = t.transactionCategory;

    // Botón editar
    const editCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'btn blue';
    editBtn.onclick = () => editTransaction(row, t);
    editCell.appendChild(editBtn);

    // Botón eliminar
    const deleteCell = row.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn red';
    deleteBtn.onclick = () => deleteTransaction(row, t.transactionId);
    deleteCell.appendChild(deleteBtn);
  }

  // Editar transacción
  function editTransaction(row, t) {
    const newDesc = prompt('Nueva descripción:', t.transactionDescription);
    const newAmount = prompt('Nuevo monto:', t.transactionAmount);

    if (newDesc && newAmount) {
      const updated = { ...t, transactionDescription: newDesc, transactionAmount: newAmount };

      fetch(`${API_URL}/${t.transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      .then(res => res.json())
      .then(data => {
        console.log('🟡 Modificada:', data);
        row.cells[1].textContent = newDesc;
        row.cells[2].textContent = newAmount;
      });
    }
  }

  // Borrar transacción
  function deleteTransaction(row, id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        console.log('🔴 Eliminada:', data);
        row.remove();
      });
  }
});
