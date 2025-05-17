
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiasBreakdown } from "@/components/BiasBreakdown";
import { SentimentChart } from "@/components/SentimentChart";
import { KeywordsCloud } from "@/components/KeywordsCloud";

interface ResultsDisplayProps {
  results: {
    biasScore: number;
    sentiment: {
      score: number;
      label: string;
    };
    politicalLean: number;
    keywords: Array<{ text: string; value: number }>;
    biasBreakdown: {
      framing: number;
      sourcing: number;
      language: number;
      context: number;
    };
  };
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const getBiasLabel = (score: number) => {
    if (score < 0.2) return "Very Low";
    if (score < 0.4) return "Low";
    if (score < 0.6) return "Moderate";
    if (score < 0.8) return "High";
    return "Very High";
  };

  const getLeanLabel = (score: number) => {
    if (score < -0.6) return "Far Left";
    if (score < -0.2) return "Left Leaning";
    if (score <= 0.2) return "Centrist";
    if (score <= 0.6) return "Right Leaning";
    return "Far Right";
  };

  const getLeanColor = (score: number) => {
    if (score < -0.6) return "text-blue-800";
    if (score < -0.2) return "text-blue-600";
    if (score <= 0.2) return "text-purple-600";
    if (score <= 0.6) return "text-red-600";
    return "text-red-800";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Analysis Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bias Score</CardTitle>
            <CardDescription>Overall detected bias level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={results.biasScore * 100} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Unbiased</span>
                <span className="font-medium">{getBiasLabel(results.biasScore)}</span>
                <span>Highly Biased</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sentiment</CardTitle>
            <CardDescription>Emotional tone of the response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center mb-2">
              {results.sentiment.label}
            </div>
            <Progress 
              value={(results.sentiment.score + 1) * 50} 
              className="h-2"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Political Leaning</CardTitle>
            <CardDescription>Detected political orientation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-center mb-2 ${getLeanColor(results.politicalLean)}`}>
              {getLeanLabel(results.politicalLean)}
            </div>
            <Progress 
              value={(results.politicalLean + 1) * 50} 
              className="h-2"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="mt-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="breakdown">Bias Breakdown</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Key Terms</TabsTrigger>
        </TabsList>
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Bias Contributors</CardTitle>
              <CardDescription>Factors contributing to bias detection</CardDescription>
            </CardHeader>
            <CardContent>
              <BiasBreakdown breakdown={results.biasBreakdown} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Emotional patterns detected in the response</CardDescription>
            </CardHeader>
            <CardContent>
              <SentimentChart sentiment={results.sentiment} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Key Terms Analysis</CardTitle>
              <CardDescription>Significant words and phrases detected</CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordsCloud keywords={results.keywords} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
