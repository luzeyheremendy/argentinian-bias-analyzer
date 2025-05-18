
import { useState, useEffect } from "react";
import { Analytics } from "@/components/Analytics";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { analysisService } from "@/services/analysisService";
import { toast } from "@/components/ui/sonner";
import { QuestionsHistory } from "@/components/QuestionsHistory";

const Index = () => {
  const [aiResponse, setAiResponse] = useState("");
  const [aiType, setAiType] = useState("gpt");
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questionsHistory, setQuestionsHistory] = useState<Array<{
    question: string;
    aiType: string;
    timestamp: Date;
  }>>([]);
  const [sampleData, setSampleData] = useState<Array<{
    question: string;
    aiType: string;
    response: string;
    timestamp: Date;
  }>>([]);

  // Load sample data when component mounts
  useEffect(() => {
    setSampleData(analysisService.loadQuestionsDatabase());
  }, []);

  const handleAnalyze = async () => {
    if (!aiResponse.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Add current question to history
      if (question.trim()) {
        setQuestionsHistory(prev => [...prev, {
          question: question,
          aiType: aiType,
          timestamp: new Date()
        }]);
      }
      
      const analysisResults = await analysisService.analyze({
        response: aiResponse,
        aiType,
        question
      });
      setResults(analysisResults);
      
      toast.success("Analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error((error as Error).message || "Failed to analyze response. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSampleData = () => {
    if (sampleData.length > 0) {
      // Pick a random sample
      const randomIndex = Math.floor(Math.random() * sampleData.length);
      const sample = sampleData[randomIndex];
      
      setQuestion(sample.question);
      setAiType(sample.aiType);
      setAiResponse(sample.response);
      
      toast.info("Sample data loaded! Click 'Analyze Response' to analyze it.");
    }
  };

  const handleSelectQuestion = (q: { question: string; aiType: string; timestamp: Date }) => {
    setQuestion(q.question);
    setAiType(q.aiType);
    
    // Try to find a matching response in sample data
    const matchingSample = sampleData.find(sample => 
      sample.question.toLowerCase() === q.question.toLowerCase() && 
      sample.aiType === q.aiType
    );
    
    if (matchingSample) {
      setAiResponse(matchingSample.response);
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
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <Analytics 
                  aiResponse={aiResponse} 
                  setAiResponse={setAiResponse}
                  aiType={aiType}
                  setAiType={setAiType}
                  question={question}
                  setQuestion={setQuestion}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  onLoadSampleData={handleLoadSampleData}
                />
              </div>

              {results && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <ResultsDisplay results={results} />
                </div>
              )}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <QuestionsHistory 
                  history={questionsHistory} 
                  onSelectQuestion={handleSelectQuestion}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
