import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useCallback } from "react";

export function SearchFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}) {
  const handleStatusChange = useCallback(
    (value: string) => {
      if (value !== status) {
        onStatusChange(value);
      }
    },
    [status, onStatusChange]
  );

  return (
    <div className="flex w-full justify-between items-center gap-4">
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="
          w-80 h-10 px-3 py-2
          bg-blue-800 text-blue-300 placeholder:text-slate-400
          border border-blue-600 rounded-md
          text-base font-normal
        "
      />
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger
          className="
            h-10 px-4 py-2 bg-blue-800 text-blue-300
            border border-blue-600 rounded-md
            flex items-center gap-2
          "
        >
          <Filter className="w-4 h-4 text-blue-400" />
          <SelectValue placeholder="Status: All" />
        </SelectTrigger>
        <SelectContent className="bg-blue-800 border border-blue-600 text-blue-200">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
