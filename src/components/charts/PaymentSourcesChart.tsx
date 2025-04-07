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

interface PaymentSource {
  source_name: string;
  total_amount: number;
  payment_count: number;
}

interface PaymentSourcesChartProps {
  paymentSources: PaymentSource[];
}

export default function PaymentSourcesChart({
  paymentSources,
}: PaymentSourcesChartProps) {
  const data = {
    labels: paymentSources.map((source) => source.source_name),
    datasets: [
      {
        label: "Total Amount",
        data: paymentSources.map((source) => source.total_amount),
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
            const source = paymentSources[context.dataIndex];
            return [
              `Total: $${context.raw.toLocaleString()}`,
              `Payments: ${source.payment_count}`,
            ];
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
