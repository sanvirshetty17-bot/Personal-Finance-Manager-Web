// ==============================
// CHARTS
// ==============================

const chartTransactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// ==============================
// 1. INCOME VS EXPENSE
// ==============================

let income = 0;
let expense = 0;

chartTransactions.forEach(function(transaction) {

    if (transaction.type === "Income") {
        income += Number(transaction.amount);
    }

    if (transaction.type === "Expense") {
        expense += Number(transaction.amount);
    }

});

const financeCanvas = document.getElementById("financeChart");

if (financeCanvas) {

    new Chart(financeCanvas, {

        type: "doughnut",

        data: {
            labels: ["Income", "Expense"],

            datasets: [{
                data: [income, expense],
                backgroundColor: ["#4CAF50", "#F44336"]
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }

    });

}


// ==============================
// 2. EXPENSES BY CATEGORY
// ==============================

const categories = {};

chartTransactions.forEach(function(transaction) {

    if (transaction.type === "Expense") {

        if (!categories[transaction.category]) {
            categories[transaction.category] = 0;
        }

        categories[transaction.category] += Number(transaction.amount);

    }

});

const categoryCanvas = document.getElementById("categoryChart");

if (categoryCanvas) {

    new Chart(categoryCanvas, {

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