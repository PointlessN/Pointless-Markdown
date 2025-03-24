import { useEffect, useState } from "react";
import { marked } from "marked";
import { Eye, FileText } from "lucide-react";

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    
    // Parse markdown to HTML
    const parsedHtml = marked.parse(markdown);
    // Ensure we only set string values to state
    if (typeof parsedHtml === 'string') {
      setHtml(parsedHtml);
    }
  }, [markdown]);

  return (
    <div className="preview-container">
      <div className="p-2 bg-card border-b border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium flex items-center">
          <Eye className="inline-block text-primary mr-2" size={16} />
          Preview
        </span>
      </div>
      
      <div className="border border-border rounded-b-md bg-background">
        {markdown ? (
          <div 
            className="prose prose-invert max-w-none p-6 overflow-auto h-[calc(100vh-200px)]" 
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        ) : (
          <div className="p-8 text-center h-[calc(100vh-200px)] flex flex-col items-center justify-center">
            <FileText className="mx-auto text-muted-foreground mb-4 opacity-30" size={48} />
            <div className="text-muted-foreground">
              Your preview will appear here once you start typing in the editor.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreview;
