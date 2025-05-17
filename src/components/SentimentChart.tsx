
import { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, Area, AreaChart, Cell, ResponsiveContainer, Legend, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SentimentChartProps {
  sentiment: {
    score: number;
    label: string;
  };
}

export const SentimentChart = ({ sentiment }: SentimentChartProps) => {
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line' | 'area'>('pie');
  
  // Convert the sentiment score to positive/neutral/negative percentages
  const normalizedScore = (sentiment.score + 1) / 2; // Convert from [-1,1] to [0,1]
  
  let positiveValue = 0;
  let neutralValue = 0;
  let negativeValue = 0;
  
  if (normalizedScore > 0.55) {
    positiveValue = normalizedScore * 100;
    neutralValue = (1 - normalizedScore) * 100;
  } else if (normalizedScore < 0.45) {
    negativeValue = (1 - normalizedScore) * 100;
    neutralValue = normalizedScore * 100;
  } else {
    neutralValue = 100 - Math.abs((normalizedScore - 0.5) * 200);
    positiveValue = Math.max(0, (normalizedScore - 0.5) * 200);
    negativeValue = Math.max(0, (0.5 - normalizedScore) * 200);
  }

  const pieData = [
    { name: 'Positive', value: positiveValue },
    { name: 'Neutral', value: neutralValue },
    { name: 'Negative', value: negativeValue },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Sentiment', positive: positiveValue, neutral: neutralValue, negative: negativeValue }
  ];

  // Create time-series data for line and area charts
  const timeSeriesData = [
    { name: 'Start', value: 0 },
    { name: 'Mid', value: sentiment.score * 50 },
    { name: 'End', value: sentiment.score * 100 }
  ];

  const COLORS = ['#4CAF50', '#9E9E9E', '#F44336'];

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Select value={chartType} onValueChange={(value: 'pie' | 'bar' | 'line' | 'area') => setChartType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-[300px]">
        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" name="Positive" fill="#4CAF50" />
              <Bar dataKey="neutral" name="Neutral" fill="#9E9E9E" />
              <Bar dataKey="negative" name="Negative" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[-100, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Sentiment" 
                stroke={sentiment.score > 0 ? "#4CAF50" : sentiment.score < 0 ? "#F44336" : "#9E9E9E"} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeSeriesData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[-100, 100]} />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Sentiment" 
                stroke={sentiment.score > 0 ? "#4CAF50" : sentiment.score < 0 ? "#F44336" : "#9E9E9E"} 
                fill={sentiment.score > 0 ? "rgba(76, 175, 80, 0.3)" : sentiment.score < 0 ? "rgba(244, 67, 54, 0.3)" : "rgba(158, 158, 158, 0.3)"} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
