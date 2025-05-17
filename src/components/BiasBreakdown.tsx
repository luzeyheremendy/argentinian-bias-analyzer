
import { Progress } from "@/components/ui/progress";

interface BiasBreakdownProps {
  breakdown: {
    framing: number;
    sourcing: number;
    language: number;
    context: number;
  };
}

export const BiasBreakdown = ({ breakdown }: BiasBreakdownProps) => {
  const items = [
    {
      name: "Framing Bias",
      value: breakdown.framing,
      description: "How the response frames the political issue"
    },
    {
      name: "Source Bias",
      value: breakdown.sourcing,
      description: "Balance and credibility of information sources"
    },
    {
      name: "Language Bias",
      value: breakdown.language,
      description: "Use of loaded or partisan language"
    },
    {
      name: "Contextual Bias",
      value: breakdown.context,
      description: "Missing context or one-sided presentation"
    },
  ];

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.name} className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-gray-500">{Math.round(item.value * 100)}%</span>
          </div>
          <Progress value={item.value * 100} className="h-2" />
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      ))}
    </div>
  );
};
