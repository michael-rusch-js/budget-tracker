// =====================
// 1. Variablen
// =====================
let balance = 0;
let transactions = [];

const balanceText = document.getElementById("balance");
const textInput = document.getElementById("textInput");
const amountInput = document.getElementById("amountInput");
const list = document.getElementById("list");

// =====================
// 2. EventListener
// =====================
document.getElementById("addIncome").addEventListener("click", function () {
    addTransaction(true);
});

document.getElementById("addExpense").addEventListener("click", function () {
    addTransaction(false);
});
amountInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTransaction(true); // Standard = Einnahme
    }
});
// =====================
// 3. Funktionen
// =====================

function addTransaction(isIncome) {
    const text = textInput.value;
    const amount = Number(amountInput.value);

    if (text === "" || amount === 0) {
        alert("Bitte alles ausfüllen");
        return;
    }

    const transaction = {
        text: text,
        amount: isIncome ? amount : -amount
    };

    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    updateBalance();

    textInput.value = "";
    amountInput.value = "";
}
// ===========================
// 4. Funktionen zum Speichern
// ===========================
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const saved = localStorage.getItem("transactions");
    if (saved) {
        transactions = JSON.parse(saved);
        updateBalance();
        renderTransactions();
    }
}
// =====================
// 5. Render-Funktionen
// =====================
function renderTransactions() {
    list.innerHTML = "";

    transactions.forEach((tr, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = tr.text + " : " + (tr.amount >= 0 ? "+" : "") + tr.amount + " €";
        span.style.color = tr.amount >= 0 ? "green" : "red";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.marginLeft = "10px";

        deleteBtn.addEventListener("click", function () {
            transactions.splice(index, 1);
            saveTransactions();
            renderTransactions();
            updateBalance();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}
// =====================
// Update Balance
// =====================
function updateBalance() {
    balance = transactions.reduce((acc, tr) => acc + tr.amount, 0);
    balanceText.textContent = "Kontostand: " + balance + " €";
}

loadTransactions();
