// ... existing code ...

const data = {
  labels: topEarners.map((earner) => earner.athlete_name),
  datasets: [
    {
      label: "Total NIL Payments",
      data: topEarners.map((earner) => earner.total_amount),
      backgroundColor: [
        "rgba(0, 53, 148, 0.95)", // NCAA Blue
        "rgba(255, 102, 0, 0.95)", // Orange
        "rgba(0, 128, 0, 0.95)", // Green
        "rgba(128, 0, 128, 0.95)", // Purple
        "rgba(255, 0, 0, 0.95)", // Red
      ],
      borderColor: [
        "rgb(0, 53, 148)",
        "rgb(255, 102, 0)",
        "rgb(0, 128, 0)",
        "rgb(128, 0, 128)",
        "rgb(255, 0, 0)",
      ],
      borderWidth: 2,
    },
  ],
};

// ... rest of the existing code ...
