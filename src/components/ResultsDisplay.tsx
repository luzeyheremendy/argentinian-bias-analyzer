
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
import { Badge } from "@/components/ui/badge";

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
    comparison?: {
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
  };
  isCompareMode?: boolean;
  aiType?: string;
  aiTypeB?: string;
}

export const ResultsDisplay = ({ results, isCompareMode, aiType, aiTypeB }: ResultsDisplayProps) => {
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
  
  // If we're in comparison mode and we have comparison results
  const comparison = isCompareMode && results.comparison;

  if (comparison) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Comparison Results</h2>
        
        <Tabs defaultValue="main-metrics">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="main-metrics">Main Metrics</TabsTrigger>
            <TabsTrigger value="bias-breakdown">Bias Breakdown</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main-metrics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bias Score Comparison */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Bias Score</CardTitle>
                  <CardDescription>Overall detected bias level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">{aiType || "Response A"}</Badge>
                      <span className="font-medium">{getBiasLabel(results.biasScore)}</span>
                    </div>
                    <Progress value={results.biasScore * 100} className="h-2 mb-4" />
                    
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">{aiTypeB || "Response B"}</Badge>
                      <span className="font-medium">{getBiasLabel(comparison.biasScore)}</span>
                    </div>
                    <Progress value={comparison.biasScore * 100} className="h-2" />
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>Unbiased</span>
                    <span>Highly Biased</span>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Comparison */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sentiment</CardTitle>
                  <CardDescription>Emotional tone of the response</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">{aiType || "Response A"}</Badge>
                      <span className="font-medium">{results.sentiment.label}</span>
                    </div>
                    <Progress value={(results.sentiment.score + 1) * 50} className="h-2 mb-4" />
                    
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">{aiTypeB || "Response B"}</Badge>
                      <span className="font-medium">{comparison.sentiment.label}</span>
                    </div>
                    <Progress value={(comparison.sentiment.score + 1) * 50} className="h-2" />
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                </CardContent>
              </Card>

              {/* Political Leaning Comparison */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Political Leaning</CardTitle>
                  <CardDescription>Detected political orientation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">{aiType || "Response A"}</Badge>
                      <span className={`font-medium ${getLeanColor(results.politicalLean)}`}>
                        {getLeanLabel(results.politicalLean)}
                      </span>
                    </div>
                    <Progress value={(results.politicalLean + 1) * 50} className="h-2 mb-4" />
                    
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">{aiTypeB || "Response B"}</Badge>
                      <span className={`font-medium ${getLeanColor(comparison.politicalLean)}`}>
                        {getLeanLabel(comparison.politicalLean)}
                      </span>
                    </div>
                    <Progress value={(comparison.politicalLean + 1) * 50} className="h-2" />
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="bias-breakdown">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2" variant="outline">{aiType || "Response A"}</Badge>
                    Bias Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BiasBreakdown breakdown={results.biasBreakdown} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2" variant="outline">{aiTypeB || "Response B"}</Badge>
                    Bias Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BiasBreakdown breakdown={comparison.biasBreakdown} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="keywords">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2" variant="outline">{aiType || "Response A"}</Badge>
                    Key Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordsCloud keywords={results.keywords} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2" variant="outline">{aiTypeB || "Response B"}</Badge>
                    Key Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordsCloud keywords={comparison.keywords} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Regular single-response display (original code)
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
