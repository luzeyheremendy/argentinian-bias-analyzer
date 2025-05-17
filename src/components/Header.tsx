
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">AB</span>
          </div>
          <span className="font-semibold text-lg text-slate-800">AI Bias Analyzer</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Github size={16} />
            <span className="hidden sm:inline">Source</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
