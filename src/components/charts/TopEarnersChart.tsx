import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopEarner {
  athlete_name: string;
  total_amount: number;
}

interface TopEarnersChartProps {
  topEarners: TopEarner[];
}

export default function TopEarnersChart({ topEarners }: TopEarnersChartProps) {
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
        ],
        borderColor: ["rgb(0, 53, 148)", "rgb(255, 102, 0)", "rgb(0, 128, 0)"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `$${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="h-full">
      <Bar data={data} options={options} />
    </div>
  );
}
