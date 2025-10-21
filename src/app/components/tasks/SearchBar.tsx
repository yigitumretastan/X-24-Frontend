// components/SearchBar.tsx
import { Search } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const theme = useTheme();

  return (
    <div className="relative w-full max-w-sm group">
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
        theme.theme === "dark"
          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-focus-within:opacity-100"
          : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100"
      } blur-xl`}></div>
      
      <div className={`relative backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
        theme.theme === "dark"
          ? "bg-gray-800/50 border-gray-700/50 group-focus-within:border-blue-500/50 group-focus-within:bg-gray-800/80"
          : "bg-white/80 border-gray-300/50 group-focus-within:border-blue-500/50 group-focus-within:bg-white/95"
      }`}>
        <Search
          className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            theme.theme === "dark" 
              ? "text-gray-400 group-focus-within:text-blue-400" 
              : "text-gray-500 group-focus-within:text-blue-500"
          }`}
        />
        <input
          type="text"
          placeholder="Görev ara..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none transition-colors duration-300 placeholder:transition-colors placeholder:duration-300 ${
            theme.theme === "dark"
              ? "text-white placeholder:text-gray-400 focus:placeholder:text-gray-500"
              : "text-gray-900 placeholder:text-gray-500 focus:placeholder:text-gray-400"
          }`}
        />
        
        {/* Search suggestions indicator */}
        {searchTerm && (
          <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 ${
            theme.theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
      
      {/* Floating label effect */}
      {searchTerm && (
        <div className={`absolute -top-2 left-4 px-2 text-xs font-medium transition-all duration-300 ${
          theme.theme === "dark"
            ? "bg-gray-900 text-blue-400"
            : "bg-white text-blue-600"
        }`}>
          Arama yapılıyor...
        </div>
      )}
    </div>
  );
}
