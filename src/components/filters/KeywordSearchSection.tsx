
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
      <h3 className="text-sm font-medium text-slate-200">Search</h3>
      <Input
        placeholder="Search by keyword..."
        value={keywordSearch}
        onChange={(e) => onKeywordSearchChange(e.target.value)}
        className="w-full bg-slate-800/50 border-slate-700/50 text-slate-50 placeholder:text-slate-400"
      />
    </div>
  );
};

export default KeywordSearchSection;
