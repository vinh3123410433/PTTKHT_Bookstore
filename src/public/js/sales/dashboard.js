document.addEventListener("DOMContentLoaded", function () {
  // Load revenue data from hidden element
  const revenueDataElement = document.getElementById("revenue-data") || {};
  // @ts-ignore
  const revenueData = JSON.parse(revenueDataElement.textContent || " ");

  // Format dates and prepare datasets
  const labels = revenueData.map((item) => {
    const date = new Date(item.Ngay);
    return date.getDate() + "/" + (date.getMonth() + 1);
  });

  const revenues = revenueData.map((item) => item.DoanhThu || 0);
  const costs = revenueData.map((item) => item.Von || 0); // Include cost data
  const profit = revenueData.map((item) => item.LoiNhuan || 0);

  // Configure and create the revenue chart
  // @ts-ignore
  const revenueChart = new Chart(
    // @ts-ignore
    document.getElementById("revenue-chart")?.getContext("2d"),
    {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Doanh thu",
            data: revenues,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Vốn",
            data: costs, // Add the cost data here
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Lợi nhuận",
            data: profit,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          // @ts-ignore
          y: {
            beginAtZero: true,
            ticks: {
              // Format large numbers with comma separators
              callback: function (value) {
                return new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(context.raw);
                return label;
              },
            },
          },
        },
      },
    }
  );

  // Other dashboard functionality can be added here
});
