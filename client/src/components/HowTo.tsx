import { HelpCircle } from "lucide-react";

const HowTo = () => {
  return (
    <div className="preview-container">
      <div className="p-2 bg-card border-b border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium flex items-center">
          <HelpCircle className="inline-block text-primary mr-2" size={16} />
          How to Use This Markdown Editor
        </span>
      </div>
      
      <div className="border border-border rounded-b-md bg-background">
        <div className="p-6 overflow-auto h-[calc(100vh-200px)]">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Pointless Markdown Guide</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3 border-b border-border pb-2">Basic Usage</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Type your markdown content in the <strong>Text</strong> tab</li>
              <li>Switch to the <strong>Preview</strong> tab to see how it looks</li>
              <li>Your work is automatically saved as you type</li>
              <li>Use the <strong>Share</strong> button to create a custom URL for your document</li>
              <li>Edit shared documents by entering the correct edit code</li>
              <li>Visit the author&apos;s GitHub page through the credit link</li>
            </ol>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3 border-b border-border pb-2">Markdown Basics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Headers</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`# Heading 1
## Heading 2
### Heading 3`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Emphasis</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`*italic text*
**bold text**
~~strikethrough~~`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Lists</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Links</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`[Link text](https://example.com)`}
                  </pre>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Images</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`![Alt text](https://example.com/image.jpg)`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Code</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`\`inline code\`

\`\`\`javascript
// Code block
function hello() {
  console.log("Hello world!")
}
\`\`\``}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Blockquotes</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`> This is a blockquote
> It can span multiple lines`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Tables</h3>
                  <pre className="bg-muted p-3 rounded-md overflow-auto">
{`| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3 border-b border-border pb-2">Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the toolbar in the editor for quick formatting</li>
              <li>Preview your content frequently to ensure proper formatting</li>
              <li>Your work is automatically saved as you type</li>
              <li>Use the &quot;How&quot; tab for quick reference while editing</li>
              <li>Create a custom URL with the Share button to share your work</li>
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-secondary/30 border border-border rounded-md">
            <p className="text-center text-foreground">
              Happy writing! <a href="https://github.com/PointlessN" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PointlessN</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;