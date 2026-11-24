// Application State
const currency = "KES";
let monthlyBudget = 0;
let expenses = []; // Array to store multiple expense objects

// DOM Element References
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetFeedback = document.getElementById("budget-feedback");

const expenseForm = document.getElementById("expense-form");
const expenseNameInput = document.getElementById("expense-name");
const expenseCategoryInput = document.getElementById("expense-category");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseFeedback = document.getElementById("expense-feedback");

const displayBudget = document.getElementById("display-budget");
const displayExpenses = document.getElementById("display-expenses");
const displayBalance = document.getElementById("display-balance");
const statusBanner = document.getElementById("status-banner");

const expenseList = document.getElementById("expense-list");
const expenseCount = document.getElementById("expense-count");
const clearAllBtn = document.getElementById("clear-all-btn");

// Helper: Format numbers as currency
function formatCurrency(amount) {
  return `${currency} ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Loop through the expenses array to calculate total spending
function calculateTotalExpenses() {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }
  return total;
}

// Evaluate budgeting scenarios with conditional statements and update the status banner
function updateBudgetStatus(totalExpenses, remainingBalance) {
  statusBanner.className = "status-banner";

  if (monthlyBudget === 0) {
    statusBanner.classList.add("status-neutral");
    statusBanner.textContent =
      "Set a monthly budget above to start tracking your spending health.";
  } else if (remainingBalance < 0) {
    statusBanner.classList.add("status-danger");
    statusBanner.textContent = `Over Budget! You have exceeded your monthly budget by ${formatCurrency(
      Math.abs(remainingBalance)
    )}.`;
  } else if (totalExpenses >= monthlyBudget * 0.8) {
    const percentUsed = ((totalExpenses / monthlyBudget) * 100).toFixed(1);
    statusBanner.classList.add("status-warning");
    statusBanner.textContent = `Caution: You have used ${percentUsed}% of your budget. ${formatCurrency(
      remainingBalance
    )} remaining.`;
  } else {
    const percentUsed = ((totalExpenses / monthlyBudget) * 100).toFixed(1);
    statusBanner.classList.add("status-healthy");
    statusBanner.textContent = `On Track! You have used ${percentUsed}% of your budget and have ${formatCurrency(
      remainingBalance
    )} left.`;
  }
}

// Render all expense items into the DOM using a loop
function renderExpenseList() {
  expenseList.innerHTML = "";
  expenseCount.textContent = expenses.length;

  if (expenses.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No expenses recorded yet.";
    expenseList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < expenses.length; i++) {
    const item = expenses[i];

    const li = document.createElement("li");
    li.className = "expense-item";

    li.innerHTML = `
      <div class="expense-details">
        <span class="expense-title">${item.name}</span>
        <span class="expense-meta">Category: ${item.category}</span>
      </div>
      <div class="expense-actions">
        <span class="expense-price">${formatCurrency(item.amount)}</span>
        <button type="button" class="btn-remove" data-index="${i}">Remove</button>
      </div>
    `;

    expenseList.appendChild(li);
  }
}

// Master function to recalculate totals and update the entire dashboard UI
function updateDashboard() {
  const totalExpenses = calculateTotalExpenses();
  const remainingBalance = monthlyBudget - totalExpenses;

  displayBudget.textContent = formatCurrency(monthlyBudget);
  displayExpenses.textContent = formatCurrency(totalExpenses);
  displayBalance.textContent = formatCurrency(remainingBalance);

  // Highlight negative balance in red
  if (remainingBalance < 0) {
    displayBalance.style.color = "#dc2626";
  } else {
    displayBalance.style.color = "#102a43";
  }

  updateBudgetStatus(totalExpenses, remainingBalance);
  renderExpenseList();
}

// Event Listener 1: Handle Budget Form Submission
budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredBudget = Number(budgetInput.value);

  if (isNaN(enteredBudget) || enteredBudget <= 0) {
    budgetFeedback.textContent = "Please enter a valid budget greater than 0.";
    budgetFeedback.className = "feedback-message feedback-error";
    return;
  }

  monthlyBudget = enteredBudget;
  budgetFeedback.textContent = `Monthly budget updated to ${formatCurrency(monthlyBudget)}.`;
  budgetFeedback.className = "feedback-message feedback-success";
  budgetInput.value = "";

  updateDashboard();
});

// Event Listener 2: Handle Add Expense Form Submission
expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = expenseNameInput.value.trim();
  const category = expenseCategoryInput.value;
  const amount = Number(expenseAmountInput.value);

  if (name === "" || isNaN(amount) || amount <= 0) {
    expenseFeedback.textContent =
      "Please enter a valid expense name and an amount greater than 0.";
    expenseFeedback.className = "feedback-message feedback-error";
    return;
  }

  // Push new expense object to the array
  expenses.push({
    name: name,
    category: category,
    amount: amount,
  });

  expenseFeedback.textContent = `Added "${name}" (${formatCurrency(amount)}).`;
  expenseFeedback.className = "feedback-message feedback-success";

  // Clear form inputs
  expenseNameInput.value = "";
  expenseAmountInput.value = "";

  updateDashboard();
});

// Event Listener 3: Handle Removing Individual Expenses (Event Delegation)
expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-remove")) {
    const index = Number(event.target.getAttribute("data-index"));
    const removedExpense = expenses.splice(index, 1)[0];

    expenseFeedback.textContent = `Removed "${removedExpense.name}".`;
    expenseFeedback.className = "feedback-message feedback-error";

    updateDashboard();
  }
});

// Event Listener 4: Handle Clearing All Expenses
clearAllBtn.addEventListener("click", function () {
  if (expenses.length === 0) {
    expenseFeedback.textContent = "There are no expenses to clear.";
    expenseFeedback.className = "feedback-message feedback-error";
    return;
  }

  expenses = [];
  expenseFeedback.textContent = "All expenses have been cleared.";
  expenseFeedback.className = "feedback-message feedback-success";

  updateDashboard();
});

// Initialize dashboard on page load
updateDashboard();
