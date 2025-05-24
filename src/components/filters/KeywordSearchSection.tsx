
import { Input } from "@/components/ui/input";

interface KeywordSearchSectionProps {
  keywordSearch: string;
  onKeywordSearchChange: (keyword: string) => void;
}

const KeywordSearchSection = ({
  keywordSearch,
  onKeywordSearchChange
}: KeywordSearchSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Search</h3>
      <Input
        placeholder="Search by keyword..."
        value={keywordSearch}
        onChange={(e) => onKeywordSearchChange(e.target.value)}
        className="w-full bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400"
      />
    </div>
  );
};

export default KeywordSearchSection;
