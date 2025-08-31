import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import React from 'react';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  locations: any;
}

// const locations = [
//   { value: 'all-locations', label: 'All Locations' },
//   { value: 'Kigali', label: 'Kigali' },
//   { value: 'Huye', label: 'Huye' },
//   { value: 'Musanze', label: 'Musanze' },
//   { value: 'Rubavu', label: 'Rubavu' },
//   { value: 'Rwanda', label: 'Rwanda' },
// ];

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  className,
  locations
}) => (
  <div
    className={`relative border border-gray-300 rounded-xl ${className || ''}`}
  >
    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none z-10" />
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="pl-10 h-12 border-border/30">
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((loc) => (
          <SelectItem key={loc.value} value={loc.value}>
            {loc.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default LocationSelect;
