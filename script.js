// State management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const form = document.getElementById('transaction-form');
const clearBtn = document.getElementById('clear-btn');
const transactionList = document.getElementById('transaction-list');
const noDataText = document.getElementById('no-data');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const currentBalanceEl = document.getElementById('current-balance');
const filterType = document.getElementById('filter-type');
const searchInput = document.getElementById('search-input');

// Event Listeners
form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', () => form.reset());
filterType.addEventListener('change', updateUI);
searchInput.addEventListener('input', updateUI);

// Initialize UI
updateUI();

function addTransaction(e) {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  // Validation: Ensure amount is greater than zero
  if (amount <= 0) {
    alert('Amount must be greater than zero.');
    return;
  }

  const transaction = {
    id: generateID(),
    type,
    description,
    amount,
    category,
    date
  };

  transactions.push(transaction);
  saveToLocalStorage();
  updateUI();
  form.reset();
  
  // Alert on success
  alert('Transaction added successfully!');
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToLocalStorage();
  updateUI();
}

function updateUI() {
  updateTotals();
  renderTable();
}

function updateTotals() {
  const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  totalIncomeEl.innerText = `LKR ${income.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  totalExpenseEl.innerText = `LKR ${expense.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  currentBalanceEl.innerText = `LKR ${balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function renderTable() {
  transactionList.innerHTML = '';
  
  const filterVal = filterType.value;
  const searchVal = searchInput.value.toLowerCase();

  const filteredTransactions = transactions.filter(t => {
    const matchType = filterVal === 'All' || t.type === filterVal;
    const matchSearch = t.description.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
    return matchType && matchSearch;
  });

  if (filteredTransactions.length === 0) {
    noDataText.classList.remove('d-none');
  } else {
    noDataText.classList.add('d-none');
    filteredTransactions.forEach(t => {
      const isIncome = t.type === 'Income';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.date}</td>
        <td>${t.description}</td>
        <td><span class="${isIncome ? 'badge-income' : 'badge-expense'}">${t.type}</span></td>
        <td>${t.category}</td>
        <td class="${isIncome ? 'amount-income' : 'amount-expense'}">
          ${isIncome ? '+' : '-'} LKR ${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${t.id})">Delete</button>
        </td>
      `;
      transactionList.appendChild(tr);
    });
  }
}

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}