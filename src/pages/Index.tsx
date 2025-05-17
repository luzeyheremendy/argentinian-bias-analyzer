
import { useState } from "react";
import { Analytics } from "@/components/Analytics";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { analysisService } from "@/services/analysisService";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [aiResponse, setAiResponse] = useState("");
  const [aiType, setAiType] = useState("gpt");
  const [question, setQuestion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [useRealTimeAnalysis, setUseRealTimeAnalysis] = useState(false);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!aiResponse.trim()) return;
    if (useRealTimeAnalysis && !apiKey.trim()) {
      toast.error("Please provide a DeepSeek API key for real-time analysis.");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const analysisResults = await analysisService.analyze({
        response: aiResponse,
        aiType,
        question,
        apiKey: useRealTimeAnalysis ? apiKey : undefined
      });
      setResults(analysisResults);
      
      if (useRealTimeAnalysis) {
        toast.success("Analysis completed using DeepSeek AI!");
      } else {
        toast.success("Analysis completed!");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze response. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800">
            AI Political Bias Analyzer
          </h1>
          
          <p className="text-slate-600 mb-8 text-center">
            Analyze how biased AI responses are to political questions. Enter a question and the AI's response below.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <Analytics 
              aiResponse={aiResponse} 
              setAiResponse={setAiResponse}
              aiType={aiType}
              setAiType={setAiType}
              question={question}
              setQuestion={setQuestion}
              apiKey={apiKey}
              setApiKey={setApiKey}
              useRealTimeAnalysis={useRealTimeAnalysis}
              setUseRealTimeAnalysis={setUseRealTimeAnalysis}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {results && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ResultsDisplay results={results} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
