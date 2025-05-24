
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeSectionProps {
  dateFromFilter: string;
  dateToFilter: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
}

const DateRangeSection = ({
  dateFromFilter,
  dateToFilter,
  onDateFromChange,
  onDateToChange
}: DateRangeSectionProps) => {
  const dateFromDate = dateFromFilter ? new Date(dateFromFilter) : undefined;
  const dateToDate = dateToFilter ? new Date(dateToFilter) : undefined;

  const handleDateFromSelect = (date: Date | undefined) => {
    if (date) {
      onDateFromChange(format(date, "yyyy-MM-dd"));
    } else {
      onDateFromChange("");
    }
  };

  const handleDateToSelect = (date: Date | undefined) => {
    if (date) {
      onDateToChange(format(date, "yyyy-MM-dd"));
    } else {
      onDateToChange("");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Date Range</h3>
      <div className="flex gap-4 items-center">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-200">From:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-40 justify-start text-left font-normal bg-slate-900 border-slate-700 text-slate-50 hover:bg-slate-800",
                  !dateFromDate && "text-slate-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-300" />
                {dateFromDate ? format(dateFromDate, "MM/dd/yyyy") : <span className="text-slate-400">mm/dd/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFromDate}
                onSelect={handleDateFromSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-200">To:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-40 justify-start text-left font-normal bg-slate-900 border-slate-700 text-slate-50 hover:bg-slate-800",
                  !dateToDate && "text-slate-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-300" />
                {dateToDate ? format(dateToDate, "MM/dd/yyyy") : <span className="text-slate-400">mm/dd/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateToDate}
                onSelect={handleDateToSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSection;
