let balance = 0;
let transactions = []; // Array für alle Einträge

const balanceText = document.getElementById("balance");
const textInput = document.getElementById("textInput");
const amountInput = document.getElementById("amountInput");
const list = document.getElementById("list");

document.getElementById("addIncome").addEventListener("click", function () {
    addTransaction(true);
});

document.getElementById("addExpense").addEventListener("click", function () {
    addTransaction(false);
});

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

    transactions.push(transaction);      // in Array speichern
    saveTransactions();                  // in LocalStorage speichern
    renderTransactions();                // in Liste anzeigen
    updateBalance();                     // Kontostand aktualisieren

    textInput.value = "";
    amountInput.value = "";
}
// Funktion zum Speichern
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
// Render-Funktion
function renderTransactions() {
    list.innerHTML = ""; // alles löschen

    transactions.forEach(tr => {
        const li = document.createElement("li");
        li.textContent = tr.text + " : " + (tr.amount >= 0 ? "+" : "") + tr.amount + " €";
        li.style.color = tr.amount >= 0 ? "green" : "red";
        list.appendChild(li);
    });
}
// Update Balance
function updateBalance() {
    balance = transactions.reduce((acc, tr) => acc + tr.amount, 0);
    balanceText.textContent = "Kontostand: " + balance + " €";
}

loadTransactions();
