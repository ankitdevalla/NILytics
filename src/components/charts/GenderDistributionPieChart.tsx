import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GenderPaymentData {
  gender: string;
  total_amount: number;
  payment_count: number;
}

interface GenderDistributionPieChartProps {
  genderData: GenderPaymentData[];
}

// Color palette for the gender pie chart
const COLORS: Record<string, string> = {
  Male: "#0088FE",
  Female: "#FF8042",
  "Non-binary": "#00C49F",
  Other: "#FFBB28",
  Unknown: "#8884d8",
};

const GenderDistributionPieChart: React.FC<GenderDistributionPieChartProps> = ({
  genderData,
}) => {
  // Calculate the total amount across all genders
  const totalAmount = genderData.reduce(
    (sum, item) => sum + item.total_amount,
    0
  );

  // Process the data to calculate accurate percentages
  const chartData = genderData.map((item) => {
    // Calculate percentage with 2 decimal places
    const percentage =
      totalAmount > 0 ? (item.total_amount / totalAmount) * 100 : 0;

    return {
      name: item.gender,
      value: item.total_amount,
      percentage: percentage.toFixed(2),
      count: item.payment_count,
    };
  });

  // Sort data by value in descending order
  chartData.sort((a, b) => b.value - a.value);

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Custom tooltip content
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: any }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-600">{data.percentage}% of total</p>
          <p className="text-sm text-gray-600">{data.count} payments</p>
        </div>
      );
    }
    return null;
  };

  // Create a custom label formatter for the legend
  const formatLegendText = (value: string) => {
    const item = chartData.find((d) => d.name === value);
    return `${value} (${item?.percentage}%)`;
  };

  // Get color for each gender
  const getGenderColor = (gender: string) => {
    return COLORS[gender] || "#8884d8"; // Default color if not found
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            innerRadius="30%"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getGenderColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={formatLegendText} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderDistributionPieChart;
