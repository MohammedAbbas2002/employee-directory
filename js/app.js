// app.js

// DOM Elements
const employeeListContainer = document.getElementById('employee-list-container');
const addEmployeeBtn = document.getElementById('add-employee');
const formSection = document.getElementById('form-section');
const employeeForm = document.getElementById('employee-form');
const cancelBtn = document.getElementById('cancel-button');

// Form Inputs
const inputId = document.getElementById('employee-id');
const inputFirstName = document.getElementById('first-name');
const inputLastName = document.getElementById('last-name');
const inputEmail = document.getElementById('email');
const inputDepartment = document.getElementById('department');
const inputRole = document.getElementById('role');

// Render Employees
function renderEmployeeList(employees = mockEmployees) {
  employeeListContainer.innerHTML = '';

  if (employees.length === 0) {
    employeeListContainer.innerHTML = '<p>No employees found.</p>';
    return;
  }

  employees.forEach(employee => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.setAttribute('data-id', employee.id);

    card.innerHTML = `
      <h3>${employee.firstName} ${employee.lastName}</h3>
      <p><strong>ID:</strong> ${employee.id}</p>
      <p><strong>Email:</strong> ${employee.email}</p>
      <p><strong>Department:</strong> ${employee.department}</p>
      <p><strong>Role:</strong> ${employee.role}</p>
      <button class="edit-btn" data-id="${employee.id}">Edit</button>
      <button class="delete-btn" data-id="${employee.id}">Delete</button>
    `;

    employeeListContainer.appendChild(card);
  });

  attachDeleteHandlers();
  attachEditHandlers();
}

// Attach Delete Events
function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));
      const confirmDelete = confirm("Are you sure you want to delete this employee?");
      if (confirmDelete) {
        const index = mockEmployees.findIndex(emp => emp.id === id);
        if (index !== -1) {
          mockEmployees.splice(index, 1);
          renderEmployeeList();
        }
      }
    });
  });
}

// Attach Edit Events
function attachEditHandlers() {
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));
      const employee = mockEmployees.find(emp => emp.id === id);
      if (employee) {
        inputId.value = employee.id;
        inputFirstName.value = employee.firstName;
        inputLastName.value = employee.lastName;
        inputEmail.value = employee.email;
        inputDepartment.value = employee.department;
        inputRole.value = employee.role;
        formSection.classList.remove('hidden');
      }
    });
  });
}

// Add Button Show Form
addEmployeeBtn.addEventListener('click', () => {
  inputId.value = '';
  employeeForm.reset();
  formSection.classList.remove('hidden');
});

// Cancel Button Hide Form
cancelBtn.addEventListener('click', () => {
  employeeForm.reset();
  formSection.classList.add('hidden');
});

// Submit Form
employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = inputId.value ? parseInt(inputId.value) : Date.now();
  const firstName = inputFirstName.value.trim();
  const lastName = inputLastName.value.trim();
  const email = inputEmail.value.trim();
  const department = inputDepartment.value.trim();
  const role = inputRole.value.trim();

  if (!firstName || !lastName || !email || !department || !role) {
    alert("All fields are required.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Invalid email format.");
    return;
  }

  const newEmployee = { id, firstName, lastName, email, department, role };
  const index = mockEmployees.findIndex(emp => emp.id === id);

  if (index !== -1) {
    mockEmployees[index] = newEmployee;
  } else {
    mockEmployees.push(newEmployee);
  }

  employeeForm.reset();
  formSection.classList.add('hidden');
  renderEmployeeList();
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  renderEmployeeList();
});

// =============================
// Search, Filter, and Sort
// =============================

let filteredEmployees = [...mockEmployees]; // Start with all

const searchInput = document.getElementById('search-input');
const filterPanel = document.getElementById('filter-panel');
const filterToggle = document.getElementById('filter-toggle');
const filterName = document.getElementById('filter-name');
const filterDepartment = document.getElementById('filter-department');
const filterRole = document.getElementById('filter-role');
const applyFiltersBtn = document.getElementById('apply-filters');
const sortSelect = document.getElementById('sort-select');

// Show/Hide Filter Panel
filterToggle.addEventListener('click', () => {
  filterPanel.classList.toggle('hidden');
});

// Apply Filters
applyFiltersBtn.addEventListener('click', () => {
  const nameVal = filterName.value.toLowerCase();
  const deptVal = filterDepartment.value.toLowerCase();
  const roleVal = filterRole.value.toLowerCase();

  filteredEmployees = mockEmployees.filter(emp => {
    return (
      emp.firstName.toLowerCase().includes(nameVal) &&
      emp.department.toLowerCase().includes(deptVal) &&
      emp.role.toLowerCase().includes(roleVal)
    );
  });

  applySearchAndSort();
});

// Search
searchInput.addEventListener('input', () => {
  applySearchAndSort();
});

// Sort
sortSelect.addEventListener('change', () => {
  applySearchAndSort();
});

// Apply Search + Sort
function applySearchAndSort() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  // Filter by search term (name or email)
  let result = filteredEmployees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm) ||
    emp.lastName.toLowerCase().includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm)
  );

  // Sort
  result.sort((a, b) => {
    if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
    if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
    return 0;
  });

  renderEmployeeList(result);
}

// =============================
// Pagination
// =============================

const paginationControls = document.getElementById('pagination-controls');
const itemsPerPageSelect = document.getElementById('items-per-page');

let currentPage = 1;
let itemsPerPage = parseInt(itemsPerPageSelect.value);

// Listen for itemsPerPage change
itemsPerPageSelect.addEventListener('change', () => {
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  currentPage = 1;
  applyPagination(filteredEmployees);
});

// Render page buttons
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  paginationControls.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) {
      btn.style.fontWeight = 'bold';
    }
    btn.addEventListener('click', () => {
      currentPage = i;
      applyPagination(filteredEmployees);
    });
    paginationControls.appendChild(btn);
  }
}

// Paginate list and render
function applyPagination(dataList) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = dataList.slice(start, end);
  renderEmployeeList(paginatedData);
  renderPagination(dataList.length);
}

// Update all logic to use pagination
function applySearchAndSort() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  let result = filteredEmployees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm) ||
    emp.lastName.toLowerCase().includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm)
  );

  result.sort((a, b) => {
    if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
    if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
    return 0;
  });

  currentPage = 1;
  applyPagination(result);
}
