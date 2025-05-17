
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KeywordsCloudProps {
  keywords: Array<{ text: string; value: number }>;
}

export const KeywordsCloud = ({ keywords }: KeywordsCloudProps) => {
  const [viewType, setViewType] = useState<'cloud' | 'chart'>('cloud');
  
  // Sort keywords by value (highest first)
  const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value);
  
  // Get font size based on value (between 1-5)
  const getFontSize = (value: number) => {
    const min = Math.min(...keywords.map(k => k.value));
    const max = Math.max(...keywords.map(k => k.value));
    const normalized = (value - min) / (max - min);
    return 0.8 + normalized * 1.2; // Scale from 0.8 to 2.0
  };

  // For pie chart
  const pieData = sortedKeywords.slice(0, 8).map(kw => ({
    name: kw.text,
    value: kw.value
  }));

  // Generate a different color for each keyword
  const COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', 
    '#a4de6c', '#d0ed57', '#ffc658', '#ff8042',
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Select value={viewType} onValueChange={(value: 'cloud' | 'chart') => setViewType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cloud">Tag Cloud</SelectItem>
            <SelectItem value="chart">Pie Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewType === 'cloud' && (
        <div className="flex flex-wrap gap-2 justify-center py-4">
          {sortedKeywords.map((keyword, index) => (
            <div
              key={index}
              className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full"
              style={{
                fontSize: `${getFontSize(keyword.value)}rem`,
                opacity: 0.6 + (keyword.value / Math.max(...keywords.map(k => k.value))) * 0.4
              }}
            >
              {keyword.text}
            </div>
          ))}
        </div>
      )}

      {viewType === 'chart' && (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
