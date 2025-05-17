
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, BookText } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Question {
  question: string;
  aiType: string;
  timestamp: Date;
}

interface QuestionsHistoryProps {
  history: Question[];
  onSelectQuestion: (question: Question) => void;
}

export const QuestionsHistory = ({ history, onSelectQuestion }: QuestionsHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredHistory = history.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getAiTypeBadgeColor = (aiType: string) => {
    switch (aiType) {
      case 'gpt':
        return 'bg-green-100 text-green-800';
      case 'grok':
        return 'bg-purple-100 text-purple-800';
      case 'claude':
        return 'bg-blue-100 text-blue-800';
      case 'gemini':
        return 'bg-yellow-100 text-yellow-800';
      case 'deepseek':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg flex items-center">
        <BookText className="mr-2 h-5 w-5" />
        Questions History
      </h2>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search questions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No questions analyzed yet.</p>
          <p className="text-sm">Questions will appear here after analysis.</p>
        </div>
      ) : (
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-2">
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredHistory.map((item, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                  onClick={() => onSelectQuestion(item)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium truncate max-w-[70%]">{item.question}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getAiTypeBadgeColor(item.aiType)}`}>
                      {item.aiType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="mt-2">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>AI</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="max-w-[140px] truncate">
                        {item.question}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getAiTypeBadgeColor(item.aiType)}`}>
                          {item.aiType}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onSelectQuestion(item)}
                        >
                          Use
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
