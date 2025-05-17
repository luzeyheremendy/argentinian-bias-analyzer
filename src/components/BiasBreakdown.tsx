
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BiasBreakdownProps {
  breakdown: {
    framing: number;
    sourcing: number;
    language: number;
    context: number;
  };
}

export const BiasBreakdown = ({ breakdown }: BiasBreakdownProps) => {
  const [chartType, setChartType] = useState<'bars' | 'radar' | 'horizontal'>('bars');

  const items = [
    {
      name: "Framing",
      value: breakdown.framing,
      description: "How the response frames the political issue",
      color: "#6366f1" // indigo
    },
    {
      name: "Sourcing",
      value: breakdown.sourcing,
      description: "Balance and credibility of information sources",
      color: "#8b5cf6" // violet
    },
    {
      name: "Language",
      value: breakdown.language,
      description: "Use of loaded or partisan language",
      color: "#ec4899" // pink
    },
    {
      name: "Context",
      value: breakdown.context,
      description: "Missing context or one-sided presentation",
      color: "#f43f5e" // rose
    },
  ];

  const chartData = items.map(item => ({
    name: item.name,
    value: item.value * 100,
    color: item.color
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <Select value={chartType} onValueChange={(value: 'bars' | 'radar' | 'horizontal') => setChartType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bars">Progress Bars</SelectItem>
            <SelectItem value="radar">Radar Chart</SelectItem>
            <SelectItem value="horizontal">Bar Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartType === 'bars' && (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{item.name} Bias</span>
                <span className="text-sm text-gray-500">{Math.round(item.value * 100)}%</span>
              </div>
              <Progress 
                value={item.value * 100} 
                className="h-2" 
                indicatorClassName={`bg-gradient-to-r from-blue-500 to-${item.color}`} 
              />
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {chartType === 'radar' && (
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Bias Factors"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'horizontal' && (
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <Legend />
              <Bar dataKey="value" name="Bias Level">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
