
import { useState } from "react";
import { Button } from "./ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Check, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LanguageSelectorVariant = "default" | "outline" | "compact";

interface LanguageSelectorProps {
  variant?: LanguageSelectorVariant;
  className?: string;
}

const LanguageSelector = ({
  variant = "default",
  className
}: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'অসমীয়া' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Implement language change logic here
    console.log(`Language changed to ${languageCode}`);
  };

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };
  
  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full", className)}
          >
            <Globe size={16} />
            <span className="sr-only">Select language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map(lang => (
            <DropdownMenuItem
              key={lang.code}
              className="flex items-center justify-between"
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
              {selectedLanguage === lang.code && <Check size={16} />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === "outline" ? "outline" : "secondary"} 
          size="sm"
          className={cn("flex items-center gap-1", className)}
        >
          <Globe size={14} />
          <span>{getLanguageName(selectedLanguage)}</span>
          <ChevronDown size={14} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center justify-between"
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.name}
            {selectedLanguage === lang.code && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
