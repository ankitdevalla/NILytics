import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Payment {
  id: string;
  amount: number;
  date: string;
  athlete_id: string;
  // Add other payment fields as needed
}

interface AccumulatedPaymentsChartProps {
  payments: Payment[];
}

const AccumulatedPaymentsChart: React.FC<AccumulatedPaymentsChartProps> = ({ 
  payments
}) => {
  // Process payment data to get accumulated totals over time
  const chartData = useMemo(() => {
    if (!payments.length) return [];

    // Sort payments by date
    const sortedPayments = [...payments].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Create a map to store accumulated payments by date
    const accumulatedByDate: Record<string, { 
      date: string, 
      displayDate: string,
      accumulated: number,
      dailyTotal: number
    }> = {};

    let runningTotal = 0;

    // Process each payment
    sortedPayments.forEach(payment => {
      const date = new Date(payment.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Format date for display
      const displayDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });

      // Initialize date if it doesn't exist
      if (!accumulatedByDate[dateKey]) {
        accumulatedByDate[dateKey] = {
          date: dateKey,
          displayDate,
          accumulated: runningTotal,
          dailyTotal: 0
        };
      }

      // Add payment amount to running total and daily total
      runningTotal += payment.amount;
      accumulatedByDate[dateKey].dailyTotal += payment.amount;
      accumulatedByDate[dateKey].accumulated = runningTotal;
    });

    // Convert map to array and sort by date
    return Object.values(accumulatedByDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [payments]);

  // Format currency for tooltip - include cents
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Total']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="accumulated"
            name="Accumulated NIL Payments"
            stroke="#0088FE"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccumulatedPaymentsChart;
