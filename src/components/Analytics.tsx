
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
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onLoadSampleData: () => void;
}

export const Analytics = ({
  aiResponse,
  setAiResponse,
  aiType,
  setAiType,
  question,
  setQuestion,
  onAnalyze,
  isAnalyzing,
  onLoadSampleData
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-gray-700">
              Analysis powered by Google Gemini AI
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 cursor-help">
                    <Info size={16} className="text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    The analysis uses Google's Gemini AI to evaluate bias in AI responses.
                    If Gemini is unavailable, we'll fall back to our built-in analysis engine.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadSampleData}
          >
            Load Sample Data
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || !aiResponse.trim()} 
          className="px-6 py-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : "Analyze Response"}
        </Button>
      </div>
    </div>
  );
};
