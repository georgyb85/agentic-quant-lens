
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (ticker: string) => void;
  availableTickers: string[];
  selectedTickers: string[];
  placeholder?: string;
  className?: string;
}

const TickerSearch = ({
  value,
  onChange,
  onSelect,
  availableTickers,
  selectedTickers,
  placeholder = "Search ticker to add...",
  className = "w-48"
}: TickerSearchProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSuggestions = availableTickers.filter(ticker => 
    ticker.toLowerCase().includes(value.toLowerCase()) &&
    !selectedTickers.includes(ticker)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setShowDropdown(inputValue.length > 0 && filteredSuggestions.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredSuggestions.length > 0) {
      onSelect(filteredSuggestions[0]);
      onChange("");
      setShowDropdown(false);
    }
  };

  const handleFocus = () => {
    if (value.length > 0 && filteredSuggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding dropdown to allow click events
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleSelect = (ticker: string) => {
    onSelect(ticker);
    onChange("");
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${className} bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400`}
      />
      
      {showDropdown && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600/50 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((ticker) => (
            <div
              key={ticker}
              className="px-3 py-2 text-slate-100 hover:bg-slate-700 cursor-pointer text-sm"
              onMouseDown={() => handleSelect(ticker)}
            >
              {ticker}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TickerSearch;
