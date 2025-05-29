
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

const AIAssistant = () => {
  const openAIAssistant = () => {
    window.open('https://9000-idx-studio-1745422910621.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev', '_blank', 'width=800,height=600');
  };

  return (
    <Button 
      onClick={openAIAssistant}
      className="fixed bottom-6 right-6 bg-scheme-primary hover:bg-scheme-primary/90 text-white shadow-lg"
    >
      <Bot className="mr-2 h-5 w-5" />
      AI Scheme Assistant
    </Button>
  );
};

export default AIAssistant;
