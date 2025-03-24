import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, Github, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  onShare: () => void;
}

const Header = ({ onShare }: HeaderProps) => {
  const { toast } = useToast();

  const handleGithubClick = () => {
    window.open("https://github.com/PointlessN", "_blank", "noopener,noreferrer");
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-primary/10 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Pointless Markdown
            </span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleGithubClick}
                  variant="outline"
                  className="border-primary/40 h-9 w-9 p-0 hover:bg-primary/10 hover:border-primary"
                  size="icon"
                >
                  <Github className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card border-primary/20">
                <p>Visit GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onShare}
                  className="bg-primary hover:bg-primary/90 h-9 w-9 p-0 shadow-md shadow-primary/20"
                  size="icon"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card border-primary/20">
                <p>Share Document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
