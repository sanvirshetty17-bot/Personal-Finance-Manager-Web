
// ----------------------
// ADD TRANSACTION PAGE
// ----------------------

const form = document.getElementById("transactionForm");
let totalIncome = 0;
let totalExpense = 0;
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;
        const description = document.getElementById("description").value;

        const transaction = {
            type,
            category,
            amount,
            date,
            description
        };

        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        transactions.push(transaction);

        localStorage.setItem("transactions", JSON.stringify(transactions));

        alert("Transaction Saved Successfully!");

        form.reset();
    });
}


// ----------------------
// DASHBOARD PAGE
// ----------------------

const tableBody = document.getElementById("transactionTable");

if (tableBody) {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    tableBody.innerHTML = "";

    

    transactions.forEach(function (transaction, index) {

        tableBody.innerHTML += `
        <tr>
            <td>${transaction.date}</td>
            <td>${transaction.type}</td>
            <td>${transaction.category}</td>
            <td>₹${transaction.amount}</td>
            <td>
                <button onclick="editTransaction(${index})">✏️</button>
                <button onclick="deleteTransaction(${index})">🗑️</button>
            </td>
        </tr>
        `;

        if (transaction.type === "Income") {
            totalIncome += Number(transaction.amount);
        } else {
            totalExpense += Number(transaction.amount);
        }

    });

    const balance = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent = "₹" + totalIncome;
    document.getElementById("totalExpense").textContent = "₹" + totalExpense;
    document.getElementById("balance").textContent = "₹" + balance;
    document.getElementById("transactionCount").textContent = transactions.length;
}


// ----------------------
// DELETE TRANSACTION
// ----------------------

function deleteTransaction(index) {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions.splice(index, 1);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    location.reload();
}


// ----------------------
// EDIT TRANSACTION
// ----------------------

function editTransaction(index) {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let tx = transactions[index];

    // Fill form (go to Add Transaction page first if needed)
    document.getElementById("type").value = tx.type;
    document.getElementById("category").value = tx.category;
    document.getElementById("amount").value = tx.amount;
    document.getElementById("date").value = tx.date;
    document.getElementById("description").value = tx.description;

    // Remove old record
    transactions.splice(index, 1);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    alert("Edit mode enabled. Update and save again.");

    // optional redirect
    window.location.href = "add-transaction.html";
}
// ----------------------
// FINANCE CHART
// ----------------------

const chartCanvas = document.getElementById("financeChart");

if (chartCanvas) {

    new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                label: "Amount (₹)",
                data: [totalIncome, totalExpense],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}