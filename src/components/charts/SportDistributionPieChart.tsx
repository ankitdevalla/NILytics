import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SportPaymentData {
  sport_name: string;
  total_amount: number;
  payment_count: number;
}

interface SportDistributionPieChartProps {
  sportData: SportPaymentData[];
}

// Color palette for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const SportDistributionPieChart: React.FC<SportDistributionPieChartProps> = ({ sportData }) => {
  // Calculate the total amount across all sports
  const totalAmount = sportData.reduce((sum, item) => sum + item.total_amount, 0);
  
  // Process the data to calculate accurate percentages
  const chartData = sportData.map(sport => {
    // Calculate percentage with 2 decimal places
    const percentage = totalAmount > 0 ? (sport.total_amount / totalAmount) * 100 : 0;
    
    return {
      name: sport.sport_name,
      value: sport.total_amount,
      percentage: percentage.toFixed(2),
      count: sport.payment_count
    };
  });

  // Sort data by value in descending order
  chartData.sort((a, b) => b.value - a.value);
  
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Custom tooltip content
  const CustomTooltip = ({ 
    active, 
    payload 
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
    const item = chartData.find(d => d.name === value);
    return `${value} (${item?.percentage}%)`;
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
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={formatLegendText} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SportDistributionPieChart;
