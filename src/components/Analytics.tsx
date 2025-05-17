
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AnalyticsProps {
  aiResponse: string;
  setAiResponse: (value: string) => void;
  aiType: string;
  setAiType: (value: string) => void;
  question: string;
  setQuestion: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  useRealTimeAnalysis: boolean;
  setUseRealTimeAnalysis: (value: boolean) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const Analytics = ({
  aiResponse,
  setAiResponse,
  aiType,
  setAiType,
  question,
  setQuestion,
  apiKey,
  setApiKey,
  useRealTimeAnalysis,
  setUseRealTimeAnalysis,
  onAnalyze,
  isAnalyzing
}: AnalyticsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="question" className="block font-medium text-gray-700">
          Political Question
        </label>
        <Input
          id="question"
          placeholder="What political question did you ask the AI?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="aiResponse" className="block font-medium text-gray-700">
            AI Response
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">AI Type:</span>
            <Select value={aiType} onValueChange={setAiType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select AI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt">ChatGPT</SelectItem>
                <SelectItem value="grok">Grok</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Textarea
          id="aiResponse"
          placeholder="Paste the AI's response here for analysis"
          value={aiResponse}
          onChange={(e) => setAiResponse(e.target.value)}
          className="w-full min-h-[200px]"
        />
      </div>
      
      <div className="p-4 border rounded-md bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useRealTimeAnalysis"
              checked={useRealTimeAnalysis}
              onChange={(e) => setUseRealTimeAnalysis(e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useRealTimeAnalysis" className="font-medium text-gray-700">
              Use DeepSeek AI for Real-Time Analysis
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 cursor-help">
                    <Info size={16} className="text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Uses DeepSeek's AI to perform more accurate analysis in real-time. 
                    Requires your own API key.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {useRealTimeAnalysis && (
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              DeepSeek API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your DeepSeek API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Your API key is used only for analysis and never stored on our servers.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || !aiResponse.trim() || (useRealTimeAnalysis && !apiKey.trim())} 
          className="px-6 py-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            useRealTimeAnalysis ? "Analyze with DeepSeek AI" : "Analyze Response"
          )}
        </Button>
      </div>
    </div>
  );
};
