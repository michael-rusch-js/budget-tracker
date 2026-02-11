// =====================
// 1. Variablen
// =====================
let balance = 0;
let transactions = [];

const themeToggle = document.getElementById("themeToggle");
const balanceText = document.getElementById("balance");
const textInput = document.getElementById("textInput");
const amountInput = document.getElementById("amountInput");
const list = document.getElementById("list");
const toggleChartBtn = document.getElementById("toggleChart");
const chartContainer = document.getElementById("chartContainer");
const ctx = document.getElementById("budgetChart").getContext("2d");

let chart; // wichtig
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
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    if (isDark) {
        themeToggle.textContent = "☀ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});
toggleChartBtn.addEventListener("click", function () {

    const isVisible = chartContainer.style.display === "block";

    if (isVisible) {
        chartContainer.style.display = "none";
        toggleChartBtn.textContent = "📊 Show Chart";
    } else {
        chartContainer.style.display = "block";
        toggleChartBtn.textContent = "❌ Close Chart";
        renderChart();
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
    if (chartContainer.style.display === "block") {
    renderChart();
}
if (chartContainer.style.display === "block") {
    renderChart();
}

    textInput.value = "";
    amountInput.value = "";
}
function renderChart() {

    const totals = calculateTotals();

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [totals.income, totals.expenses],
                backgroundColor: [
                    "#4CAF50", // Grün Income
                    "#f44336"  // Rot Expense
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 800
            }
        }
    });
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

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀ Light Mode";
}
function calculateTotals() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(function(transaction) {
        if (transaction.amount > 0) {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    return {
        income: income,
        expenses: Math.abs(expenses)
    };
}
