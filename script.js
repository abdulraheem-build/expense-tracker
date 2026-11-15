const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = [];
try {
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
} catch (e) {
    transactions = [];
}

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    if (Number(amount.value) === 0) {
        alert('Amount cannot be zero');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value.trim(),
        amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Builds the list item with textContent (safe: user text can never run as HTML)
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = transaction.text;

    const value = document.createElement('span');
    value.className = 'amt';
    value.textContent = `${sign}Rs ${Math.abs(transaction.amount)}`;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'x';
    del.setAttribute('aria-label', 'Delete transaction');
    del.addEventListener('click', () => removeTransaction(transaction.id));

    item.append(label, value, del);
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `Rs ${total}`;
    moneyPlus.innerText = `+Rs ${income}`;
    moneyMinus.innerText = `-Rs ${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    try {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (e) {}
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);
