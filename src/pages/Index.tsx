
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
  
  // New state for comparison mode
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [aiResponseB, setAiResponseB] = useState("");
  const [aiTypeB, setAiTypeB] = useState("claude");

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
      
      const analysisInput: {
        response: string;
        aiType: string;
        question: string;
        compareWith?: {
          response: string;
          aiType: string;
        };
      } = {
        response: aiResponse,
        aiType,
        question
      };
      
      // If in compare mode, add the second response
      if (isCompareMode && aiResponseB.trim()) {
        analysisInput.compareWith = {
          response: aiResponseB,
          aiType: aiTypeB
        };
      }
      
      const analysisResults = await analysisService.analyze(analysisInput);
      setResults(analysisResults);
      
      toast.success(isCompareMode ? "Comparison completed!" : "Analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error((error as Error).message || "Failed to analyze response. Please try again.");
    } finally {
      setIsAnalyzing(false);
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
            {isCompareMode 
              ? "Compare bias between two different AI responses to the same political question." 
              : "Analyze how biased AI responses are to political questions."}
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
                  aiResponseB={aiResponseB}
                  setAiResponseB={setAiResponseB}
                  aiTypeB={aiTypeB}
                  setAiTypeB={setAiTypeB}
                  isCompareMode={isCompareMode}
                  setIsCompareMode={setIsCompareMode}
                />
              </div>

              {results && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <ResultsDisplay results={results} isCompareMode={isCompareMode} aiType={aiType} aiTypeB={aiTypeB} />
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
