import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LabelList
} from 'recharts';

interface SpendingLimit {
  id: string;
  sport_id: string;
  sport_name: string;
  limit_amount: number;
  period: "monthly" | "quarterly" | "yearly";
  created_at: string;
  updated_at: string;
}

interface SportPaymentData {
  sport_id: string;
  sport_name: string;
  total_amount: number;
  payment_count: number;
}

interface SpendingLimitsChartProps {
  spendingLimits: SpendingLimit[];
  sportPaymentData: SportPaymentData[];
  period: string;
}

const SpendingLimitsChart: React.FC<SpendingLimitsChartProps> = ({ 
  spendingLimits,
  sportPaymentData,
  period
}) => {
  // Process data to combine spending limits with actual spending
  const chartData = useMemo(() => {
    if (!spendingLimits.length || !sportPaymentData.length) return [];

    // Filter spending limits based on selected period
    const filteredLimits = spendingLimits.filter(limit => {
      if (period === '30days' && limit.period === 'monthly') return true;
      if (period === '90days' && limit.period === 'quarterly') return true;
      if (period === '12months' && limit.period === 'yearly') return true;
      if (period === 'all') return true;
      return false;
    });

    // Create a map of sport_id to spending limit
    const limitMap = new Map<string, number>();
    filteredLimits.forEach(limit => {
      limitMap.set(limit.sport_id, limit.limit_amount);
    });

    // Combine spending limits with actual spending
    const result = sportPaymentData.map(sport => {
      const limit = limitMap.get(sport.sport_id) || 0;
      if (limit === 0) return null; // Skip sports without limits
      
      const used = Math.min(sport.total_amount, limit); // Cap at limit for display purposes
      const remaining = Math.max(0, limit - sport.total_amount);
      const percentUsed = (used / limit) * 100;
      const isOverLimit = sport.total_amount > limit;
      
      return {
        sport_name: sport.sport_name,
        used: used,
        remaining: remaining,
        limit: limit,
        percentUsed: percentUsed.toFixed(1),
        isOverLimit: isOverLimit,
        // For tooltip and display
        actualAmount: sport.total_amount,
        overAmount: isOverLimit ? sport.total_amount - limit : 0
      };
    }).filter(Boolean); // Remove null entries
    
    // Sort by limit amount (budget) from highest to lowest
    return result.sort((a, b) => b!.limit - a!.limit);
  }, [spendingLimits, sportPaymentData, period]);

  // Format currency for tooltip and labels
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip to show budget usage details
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            Budget: {formatCurrency(data.limit)}
          </p>
          <p className="text-sm text-red-600">
            Used: {formatCurrency(data.actualAmount)} ({data.percentUsed}%)
          </p>
          <p className="text-sm text-green-600">
            Remaining: {formatCurrency(Math.max(0, data.limit - data.actualAmount))}
          </p>
          {data.isOverLimit && (
            <p className="text-sm font-bold text-red-700">
              Over Budget: {formatCurrency(data.overAmount)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom label for the bars
  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const data = chartData[index];
    const percentage = data!.percentUsed;
    
    return (
      <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" dominantBaseline="middle">
        {percentage}%
      </text>
    );
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 50 }}
          barSize={40}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number"
            tickFormatter={formatCurrency}
            domain={[0, 'dataMax']}
          />
          <YAxis 
            type="category"
            dataKey="sport_name" 
            width={120}
            tick={props => {
              const { x, y, payload } = props;
              const sportData = chartData.find(item => item?.sport_name === payload.value);
              const isOverBudget = sportData?.isOverLimit;
              
              return (
                <g transform={`translate(${x},${y})`}>
                  <text x={-10} y={0} dy={4} textAnchor="end" fill={isOverBudget ? "#ef4444" : "#666"} fontSize={12}>
                    {payload.value}
                    {isOverBudget}
                  </text>
                </g>
              );
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="used" 
            name="Used Budget" 
            stackId="a"
            fill="#ef4444" // Red for used budget
          >
            <LabelList dataKey="percentUsed" position="insideRight" fill="#fff" formatter={(value: string) => `${value}%`} />
            {/* Add OVER BUDGET label for sports that exceed their budget */}
            <LabelList
              dataKey="isOverLimit"
              position="right"
              fill="#ef4444"
              fontSize={12}
              fontWeight="bold"
              formatter={(value: boolean) => value ? 'OVER BUDGET' : ''}
              offset={10}
            />
          </Bar>
          <Bar 
            dataKey="remaining" 
            name="Remaining Budget" 
            stackId="a"
            fill="#22c55e" // Green for remaining budget
          />
          <ReferenceLine x={0} stroke="#000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingLimitsChart;
