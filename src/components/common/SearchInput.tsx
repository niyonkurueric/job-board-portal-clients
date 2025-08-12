import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onKeyPress, placeholder, className }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
    <Input
      placeholder={placeholder || 'Search...'}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className={`pl-10 h-12 border-border/30 focus:border-primary ${className || ''}`}
    />
  </div>
);

export default SearchInput;
