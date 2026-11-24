# SpendWise — Interactive Budgeting Application

## Improvements Made to SpendWise This Week
Last week, SpendWise relied on browser `prompt()` dialogs, single variables for two hardcoded expenses, and `console.log()` output. This week, SpendWise was upgraded into a fully interactive web dashboard where users can set a monthly budget via a form, add unlimited expenses with categories, remove individual items or clear the entire list, and view live financial totals and budget health feedback directly on the page.

## How Conditionals Are Used in the Project
Conditional statements (`if` / `else if` / `else`) control both input validation and financial feedback:
- **Input Validation:** Checks whether the user entered a valid positive number for the budget and non-empty text plus a positive amount for each expense before saving data.
- **Budget Health Evaluation:** Compares `totalExpenses` and `remainingBalance` against `monthlyBudget` to display four distinct states in the status banner:
  - **Neutral:** No budget has been set yet (`monthlyBudget === 0`).
  - **Over Budget (Red):** Spending exceeds the budget (`remainingBalance < 0`).
  - **Caution (Yellow):** Spending reaches 80% or more of the budget (`totalExpenses >= monthlyBudget * 0.8`).
  - **On Track (Green):** Spending is safely below 80% of the budget.
- **Balance Highlighting & Empty States:** Changes the remaining balance text color to red when negative and renders a placeholder message when the `expenses` array is empty.

## How Arrays Are Used to Store Data
Instead of storing expenses in separate variables (`firstExpenseAmount`, `secondExpenseAmount`), SpendWise uses a single dynamic array (`let expenses = []`). Each time a user submits the expense form, an object containing `{ name, category, amount }` is added to the array using `.push()`. When a user deletes an item, `.splice()` removes that specific record by its array index, and clicking **Clear All** resets the array to `[]`.

## How the DOM Is Updated
JavaScript dynamically updates the webpage using DOM manipulation methods:
- **`document.getElementById()`** selects the summary cards (`display-budget`, `display-expenses`, `display-balance`), feedback paragraphs, and status banner.
- **`.textContent`** updates monetary totals, item counts, and status messages in real time whenever data changes.
- **`document.createElement()` and `.appendChild()`** loop through the `expenses` array inside `renderExpenseList()` to build and insert `<li>` elements for each recorded expense.
- **`.className` and `.classList.add()`** dynamically switch CSS styling classes on the status banner to reflect healthy, warning, or over-budget conditions.

## How User Interactions Are Handled Through Events
Event listeners connect user actions directly to application updates:
- **`submit` on `#budget-form`:** Calls `event.preventDefault()`, validates the input, updates `monthlyBudget`, and refreshes the dashboard.
- **`submit` on `#expense-form`:** Calls `event.preventDefault()`, adds the new expense object to the `expenses` array, clears the form fields, and triggers `updateDashboard()`.
- **`click` on `#expense-list` (Event Delegation):** Detects clicks on dynamically generated `.btn-remove` buttons using `event.target`, reads the item's `data-index`, removes it from the array, and re-renders the UI.
- **`click` on `#clear-all-btn`:** Empties the `expenses` array and resets the dashboard totals.

## Challenges Encountered and How They Were Resolved
- **Handling Delete Buttons on Dynamically Created Items:** Because expense `<li>` elements are recreated every time the list updates, attaching individual click listeners to each delete button caused extra complexity. I resolved this using **event delegation**—attaching a single `click` listener to the parent `<ul>` (`#expense-list`) and checking `event.target.classList.contains("btn-remove")` with a `data-index` attribute.
- **Preventing Page Reloads on Form Submit:** Submitting HTML forms refreshes the browser by default and wipes JavaScript variables in memory. Calling `event.preventDefault()` inside both form submit handlers kept the page state intact while updating the DOM smoothly.

## How to Run
1. Clone or download this repository.
2. Open `index.html` in any web browser.
3. Set your monthly budget, add or remove expenses, and watch the dashboard and budget status banner update automatically.
