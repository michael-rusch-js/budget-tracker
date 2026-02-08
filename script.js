let balance = 0;

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

    if (isIncome) {
        balance += amount;
    } else {
        balance -= amount;
    }

    balanceText.textContent = "Kontostand: " + balance + " €";

    const li = document.createElement("li");
    li.textContent = text + " : " + (isIncome ? "+" : "-") + amount + " €";
    list.appendChild(li);

    textInput.value = "";
    amountInput.value = "";
}