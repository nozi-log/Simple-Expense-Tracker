// Function to generate pie chart
function generatePieChart(data) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);

    // Destroy the previous chart if it exists
    if (window.expenseChart && typeof window.expenseChart.destroy === 'function') {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
            }]
        },
        options: {
            responsive: true
        }
    });
}
