
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface SentimentChartProps {
  sentiment: {
    score: number;
    label: string;
  };
}

export const SentimentChart = ({ sentiment }: SentimentChartProps) => {
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

  const data = [
    { name: 'Positive', value: positiveValue },
    { name: 'Neutral', value: neutralValue },
    { name: 'Negative', value: negativeValue },
  ].filter(item => item.value > 0);

  const COLORS = ['#4CAF50', '#9E9E9E', '#F44336'];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
