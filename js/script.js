const form = document.getElementById("transactionForm");
let totalIncome = 0;
let totalExpense = 0;

if(form){

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let editIndex = localStorage.getItem("editIndex");

    if(editIndex !== null){

        let transaction = transactions[editIndex];

        document.getElementById("type").value = transaction.type;
        document.getElementById("category").value = transaction.category;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("date").value = transaction.date;
        document.getElementById("description").value = transaction.description;
    }
    form.addEventListener("submit", function(event) {

    event.preventDefault();

const transaction = {
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    amount: parseFloat(document.getElementById("amount").value),
    date: document.getElementById("date").value,
    description: document.getElementById("description").value
};

if (editIndex !== null) {

    transactions[editIndex] = transaction;

    localStorage.removeItem("editIndex");

    alert("Transaction Updated Successfully!");

} else {

    transactions.push(transaction);

    alert("Transaction Added Successfully!");

}

localStorage.setItem("transactions", JSON.stringify(transactions));

window.location.href = "dashboard.html";

});
}



// ======================
// DASHBOARD
// ======================

const tableBody = document.getElementById("transactionTable");

if (tableBody) {

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


searchInput.addEventListener("keyup", function(){
    displayTransactions(searchInput.value);
});


filterType.addEventListener("change", function(){
    displayTransactions(searchInput.value);
});




displayTransactions();


function displayTransactions(searchText = "") {

    tableBody.innerHTML = "";

    totalIncome = 0;
    totalExpense = 0;

    let count = 0;


    transactions.forEach(function(transaction,index){


        const matchesSearch =
        transaction.category.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchText.toLowerCase());


        const matchesFilter =
        filterType.value === "All" ||
        transaction.type === filterType.value;



        if(matchesSearch && matchesFilter){


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


            count++;


            if(transaction.type==="Income"){
                totalIncome += Number(transaction.amount);
            }
            else{
                totalExpense += Number(transaction.amount);
            }

        }

    });


    document.getElementById("totalIncome").textContent="₹"+totalIncome;
    document.getElementById("totalExpense").textContent="₹"+totalExpense;
    document.getElementById("balance").textContent="₹"+(totalIncome-totalExpense);
    document.getElementById("transactionCount").textContent=count;
const ctx = document.getElementById("financeChart");

if (ctx) {

    if (window.financeChart) {
        window.financeChart.destroy();
    }

    window.financeChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                label: "Amount (₹)",
                data: [totalIncome, totalExpense]
            }]
        },
       options: {
    responsive: true
}
    });

}
}

}
function editTransaction(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "add-transaction.html";
}

function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (confirm("Delete this transaction?")) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        location.reload();
    }
}
// =========================
// Expenses by Category Chart
// =========================

// Reuse the existing 'transactions' array
const categories = {};

transactions.forEach(transaction => {
    if (transaction.type === "Expense") {
        categories[transaction.category] =
            (categories[transaction.category] || 0) + Number(transaction.amount);
    }
});

const categoryCanvas = document.getElementById("categoryChart");

if (categoryCanvas) {

    const categoryCtx = categoryCanvas.getContext("2d");

    new Chart(categoryCtx, {
        type: "bar",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: "Expenses (₹)",
                data: Object.values(categories),
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