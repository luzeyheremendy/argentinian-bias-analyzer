
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Info, Compare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface AnalyticsProps {
  aiResponse: string;
  setAiResponse: (value: string) => void;
  aiType: string;
  setAiType: (value: string) => void;
  question: string;
  setQuestion: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  
  // New comparison props
  aiResponseB: string;
  setAiResponseB: (value: string) => void;
  aiTypeB: string;
  setAiTypeB: (value: string) => void;
  isCompareMode: boolean;
  setIsCompareMode: (value: boolean) => void;
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
  aiResponseB,
  setAiResponseB,
  aiTypeB,
  setAiTypeB,
  isCompareMode,
  setIsCompareMode
}: AnalyticsProps) => {
  const [activeTab, setActiveTab] = useState<string>("response-a");
  
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

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">AI Responses</h3>
        <div className="flex items-center">
          <Button
            variant={isCompareMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCompareMode(!isCompareMode)}
            className="flex items-center gap-2"
          >
            <Compare size={16} />
            {isCompareMode ? "Comparing" : "Compare Two AIs"}
          </Button>
        </div>
      </div>
      
      {isCompareMode ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="response-a">Response A</TabsTrigger>
            <TabsTrigger value="response-b">Response B</TabsTrigger>
          </TabsList>
          
          <TabsContent value="response-a" className="space-y-4">
            <div className="flex justify-end items-center space-x-2">
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
            <Textarea
              placeholder="Paste the first AI's response here"
              value={aiResponse}
              onChange={(e) => setAiResponse(e.target.value)}
              className="w-full min-h-[200px]"
            />
          </TabsContent>
          
          <TabsContent value="response-b" className="space-y-4">
            <div className="flex justify-end items-center space-x-2">
              <span className="text-sm text-gray-500">AI Type:</span>
              <Select value={aiTypeB} onValueChange={setAiTypeB}>
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
            <Textarea
              placeholder="Paste the second AI's response here"
              value={aiResponseB}
              onChange={(e) => setAiResponseB(e.target.value)}
              className="w-full min-h-[200px]"
            />
          </TabsContent>
        </Tabs>
      ) : (
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
      )}
      
      <div className="p-4 border rounded-md bg-slate-50">
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
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || (!aiResponse.trim() || (isCompareMode && !aiResponseB.trim()))} 
          className="px-6 py-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : isCompareMode ? "Compare Responses" : "Analyze Response"}
        </Button>
      </div>
    </div>
  );
};
