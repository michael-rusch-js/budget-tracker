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
document.getElementById("addIncome").addEventListener("click", () => addTransaction(true));
document.getElementById("addExpense").addEventListener("click", () => addTransaction(false));

amountInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTransaction(true);
});

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
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

    if (!text || amount === 0) {
        alert("Bitte alles ausfüllen");
        return;
    }

    const transaction = {
        text,
        amount: isIncome ? amount : -amount
    };

    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    updateBalance();

    if (chartContainer.style.display === "block") renderChart();

    textInput.value = "";
    amountInput.value = "";
}

// =====================
// 4. Chart
// =====================
function renderChart() {
    const totals = calculateTotals();
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [totals.income, totals.expenses],
                backgroundColor: ["#4CAF50", "#f44336"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            animation: { animateScale: true, animateRotate: true, duration: 800 }
        }
    });
}

// =====================
// 5. LocalStorage
// =====================
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const saved = localStorage.getItem("transactions");
    if (saved) {
        transactions = JSON.parse(saved);
        renderTransactions();
        updateBalance();
    }
}

// =====================
// 6. Render Transactions
// =====================
function renderTransactions() {
    list.innerHTML = "";

    transactions.forEach((tr, index) => {
        const li = document.createElement("li");

        // Hier kommt die Darstellung der Transaktion
        li.innerHTML = `
    <span class="${tr.amount >= 0 ? "income" : "expense"}">
        ${tr.text}
    </span>
    <strong>${tr.amount >= 0 ? "+" : ""}${tr.amount} €</strong>
    <button>❌</button>
`;

        // Delete Button EventListener
        const deleteBtn = li.querySelector("button");
        deleteBtn.addEventListener("click", () => {
            transactions.splice(index, 1);
            saveTransactions();
            renderTransactions();
            updateBalance();
            if (chartContainer.style.display === "block") renderChart();
        });

        list.appendChild(li);
    });
}

// =====================
// 7. Balance Update
// =====================
function updateBalance() {
    balance = transactions.reduce((acc, tr) => acc + tr.amount, 0);
    balanceText.textContent = "Kontostand: " + balance + " €";
}

// =====================
// 8. Theme laden
// =====================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀ Light Mode";
}

// =====================
// 9. Calculate Totals
// =====================
function calculateTotals() {
    let income = 0, expenses = 0;
    transactions.forEach(tr => {
        if (tr.amount > 0) income += tr.amount;
        else expenses += Math.abs(tr.amount);
    });
    return { income, expenses };
}

// =====================
// 10. Start
// =====================
loadTransactions();
