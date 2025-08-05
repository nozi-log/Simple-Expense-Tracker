$(document).ready(function() {
    const currentUser = localStorage.getItem('currentUser');

    // Redirect to login page if currentUser is not found
    if (!currentUser) {
        window.location.href = 'login.html';
    }

    // Retrieve username from localStorage
    const username = localStorage.getItem('currentUser');

    // Check if username exists
    if (username) {
        // Display personalized greeting
        $('#username-greeting').text('Hi, ' + username);
    } else {
        // If no username found, redirect to login page
        window.location.href = 'login.html';
    }

    const userExpensesKey = `expenses_${currentUser}`;
    let expenses = JSON.parse(localStorage.getItem(userExpensesKey)) || [];

    function updateExpenses() {
        localStorage.setItem(userExpensesKey, JSON.stringify(expenses));

        $('#expense-table tbody').empty();

        expenses.forEach((expense, index) => {
            $('#expense-table tbody').append(`
                <tr>
                    <td>${expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category || 'N/A'}</td>
                    <td>
                        <button class="btn btn-info btn-sm edit-btn" data-index="${index}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            `);
        });

        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        $('#total-expenses').text(`RM ${total.toFixed(2)}`);

        // Do not call generatePieChart here, as it will be handled by filterExpensesByMonth
    }

    function resetForm() {
        $('#date').val('');
        $('#amount').val('');
        $('#description').val('');
        $('#expense-form').data('index', -1);
    }

    $('#expense-form').submit(function(event) {
        event.preventDefault();

        const date = $('#date').val();
        const amount = parseFloat($('#amount').val());
        const description = $('#description').val();
        const category = $('#category-icons button.active').data('category');

        const index = $(this).data('index');
        if (index === -1) {
            expenses.push({ date, amount, description, category });
        } else {
            expenses[index] = { date, amount, description, category };
        }

        updateExpenses();
        resetForm();
    });

    $(document).on('click', '.edit-btn', function() {
        const index = $(this).data('index');
        const expense = expenses[index];

        $('#date').val(expense.date);
        $('#amount').val(expense.amount);
        $('#description').val(expense.description);
        $('#expense-form').data('index', index);
    });

    $(document).on('click', '.delete-btn', function() {
        const index = $(this).data('index');
        expenses.splice(index, 1);
        updateExpenses();
    });

    $('#category-icons').on('click', 'button', function() {
        $(this).addClass('active').siblings().removeClass('active');
    });

    updateExpenses();
    resetForm();

    // Initialize jQuery UI Datepicker
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'MM yy',
        onClose: function(dateText, inst) {
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));
            filterExpensesByMonth(new Date(year, month, 1)); // Filter expenses by the selected month
        }
    });

    // Logout function
    $('#logout').click(function() {
        // Clear currentUser from localStorage
        localStorage.removeItem('currentUser');
        // Redirect to login page
        window.location.href = 'login.html';
    });

    // Function to filter expenses by month
    function filterExpensesByMonth(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
        });
        const totalExpensesPerCategory = calculateTotalExpensesPerCategory(filteredExpenses);
        generatePieChart(totalExpensesPerCategory);
    }

    // Function to calculate total expenses per category
    function calculateTotalExpensesPerCategory(expenses) {
        const totalExpensesPerCategory = {};
        expenses.forEach(expense => {
            if (totalExpensesPerCategory[expense.category]) {
                totalExpensesPerCategory[expense.category] += expense.amount;
            } else {
                totalExpensesPerCategory[expense.category] = expense.amount;
            }
        });
        return totalExpensesPerCategory;
    }
});