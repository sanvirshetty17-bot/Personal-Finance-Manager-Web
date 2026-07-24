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

searchInput.addEventListener("keyup", function () {
    displayTransactions(searchInput.value);
});
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    displayTransactions();
    function displayTransactions(searchText = "") {

   function displayTransactions(searchText = "") {

    tableBody.innerHTML = "";

    totalIncome = 0;
    totalExpense = 0;

    let count = 0;

    transactions.forEach(function(transaction, index) {

        const matchesSearch =
            transaction.category.toLowerCase().includes(searchText.toLowerCase());

        if (matchesSearch) {

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

            if (transaction.type === "Income") {
                totalIncome += Number(transaction.amount);
            } else {
                totalExpense += Number(transaction.amount);
            }

        }

    });

    const balance = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent = "₹" + totalIncome;
    document.getElementById("totalExpense").textContent = "₹" + totalExpense;
    document.getElementById("balance").textContent = "₹" + balance;
    document.getElementById("transactionCount").textContent = count;

}