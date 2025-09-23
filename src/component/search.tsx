import React from 'react';
import { Search, XCircle } from 'lucide-react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => (
  <div className="relative w-full md:w-1/3">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
    <input
      type="text"
      placeholder="Search by product name..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
    />
    {value && (
      <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <XCircle className="h-5 w-5" />
      </button>
    )}
  </div>
);

export default SearchInput;
